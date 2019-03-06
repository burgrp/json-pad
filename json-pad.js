const error = require("debug")("app:error");
const fs = require("fs");
const pro = require("util").promisify;
const chokidar = require("chokidar");

module.exports = options => {


    return (docName, defaultData) => {

        let fileName = options.path || ".";
        if (!fileName.endsWith("/")) {
            fileName += "/";
        }
        fileName += docName + ".json";

        return {
            async load() {
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
            },

            async save(data) {
                await pro(fs.writeFile)(fileName, JSON.stringify(data, null, options.pretty? 2: undefined), "utf8");
            },

            watch(cb, watchOptions) {

                let that = this;
                function fileChanged() {
                    async function doAsync() {
                        await cb(that);
                    }
                    doAsync().catch(e => {
                        error("Error in jstore callback:", e.message || e);
                    });
                }

                let fsWatcher = chokidar.watch(fileName, {
                    ignoreInitial: true,
                    awaitWriteFinish: {
                        stabilityThreshold: 500
                    },
                    ...watchOptions
                });

                fsWatcher.on("add", fileChanged);
                fsWatcher.on("change", fileChanged);
                fsWatcher.on("unlink", fileChanged);
            }
        }
    }


}