# json-pad
Simple JSON persistence with filesystem watch

This is just another library to load and save JSON data from a directory.
In addition to that, the library:
- creates the directory if not exists
- optionally watches filesystem for changes and calls you back on file change

```js
const jsonPad = require("json-pad")({
    path: "./data"
});

async function test() {

    // create 'numbers' storage, with a default value
    let numbers = jsonPad("numbers", [1, 2, 3]);

    // load data
    console.info("LOAD:", await numbers.load());

    // we can watch for external changes of the JSON file
    numbers.watch(async data => {
        console.info("CHANGED:", await data.load());
    });

    // save data
    await numbers.save([4, 5, 6]);

}

test().catch(console.error);
```