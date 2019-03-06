const error = require("debug")("app:error");
const fs = require("fs");
const pro = require("util").promisify;
const chokidar = require("chokidar");

module.exports = options => {


    return (docName, cb, defaultData) => {

        let fileName = options.path || ".";
        if (!fileName.endsWith("/")) {
            fileName += "/";
        }
        fileName += docName + ".json";

        async function load() {
            let data;
            try {
                data = await pro(fs.readFile)(fileName, "utf8");
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    data = defaultData;
                }
            } catch (e) {
                if (e.code === "ENOENT") {
                    data = defaultData;
                } else {
                    throw e;
                }
            }
            return data;
        }

        function fileChanged() {
            async function doAsync() {
                await cb(await load());
            }
            doAsync().catch(e => {
                error("Error in jstore callback:", e.message || e);
            });
        }

        let fsWatcher = chokidar.watch(fileName, {
            awaitWriteFinish: {
                stabilityThreshold: 500
            }
        });

        fsWatcher.on("add", fileChanged);
        fsWatcher.on("change", fileChanged);
        fsWatcher.on("unlink", fileChanged);

        return {
            async save(data) {
                await pro(fs.writeFile)(fileName, JSON.stringify(data, null, 2), "utf8");
            }
        }
    }


}