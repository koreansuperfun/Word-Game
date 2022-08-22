
const fs = require("fs");

let words = fs.readFileSync("../data/words.txt").toString().replace(/(\n)/gm, "").split("\r");

words.sort((a, b) => a.length - b.length);

words = words.map(word => word.toUpperCase());

words = words.filter(word => word.length > 1);

// console.log(words);
// let test = "FORMALDEHYDESULPHOXYLATE"
// console.log(test.length);
let word_counter = count_number_of_word_lengths(words);
console.log(word_counter);


function count_number_of_word_lengths(arr_words) {
    let counter = new Array(26).fill(0);
    for (let i = 0; i < arr_words.length; ++i) {
        counter[arr_words[i].length]++;
    }
    return counter;
}