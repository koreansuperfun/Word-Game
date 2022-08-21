/**
 * Doing some few edits to the master list.
 * We want to make sure there are words available in every length from 1-25.
 *
 */


const fs = require("fs");

let words = fs.readFileSync("../data/words.txt").toString().replace(/(\n)/gm, "").split("\r");


words.sort(function(a, b) {
    return a.length - b.length;
});

console.log(words);



