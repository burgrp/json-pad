const jstore = require("./jstore.js")({
    path: "./data"
});

async function test() {

    let numbers = jstore("numbers", data => {
        console.info("NUMBERS:", data);
    }, []);

    setTimeout(() => {
        numbers.save([42, 43]).catch(console.error);
    }, 1000);

}

test().catch(console.error);