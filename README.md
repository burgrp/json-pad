# json-pad
Simple JSON persistence with filesystem watch

This is just another library to load and save JSON data from a directory.

```js
const jstore = require("json-pad")({
    path: "./data"
});

async function test() {

    let numbers = jstore("numbers", [1, 2, 3]);

    console.info("LOAD:", await numbers.load());

    numbers.watch(async data => {
        console.info("CHANGED:", await data.load());
    });

    numbers.save([4, 5, 6]).catch(console.error);

}

test().catch(console.error);
```