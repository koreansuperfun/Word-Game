/**
 * Doing some few edits to the master list.
 * We want to make sure there are words available in every length from 1-24.
 *
 */


const fs = require("fs");

let words = fs.readFileSync("../data/words.txt").toString().replace(/(\n)/gm, "").split("\r");

words.sort((a, b) => b.length - a.length);

words = words.map(word => word.toUpperCase());

// console.log(words);
let test = "FORMALDEHYDESULPHOXYLATE"
console.log(test.length);