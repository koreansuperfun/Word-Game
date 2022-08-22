const http = require('http');
const url = require('url');
const fs = require("fs");

const port = 9001;
const approvedSource = "*";
const GET = 'GET';
const POST = 'POST';
const maxLenghtWords = 12;
const minLengthWords = 3;
const wordHistoryFile = "word_history.json";
const dataDirectory = "../data/";


http.createServer(function(req, res) {
    res.writeHead(200, {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin" : approvedSource,
        "Access-Control-Allow-Methods" : approvedSource
    });

    if (req.method === GET) {
        getRequest(res);
    }


}).listen(port);
console.log("Listening...");

getRequest = function(res) {

    let jsonWordHistory = fs.readFileSync(dataDirectory + wordHistoryFile);
    if (jsonWordHistory.length === 0) {
        console.log("Arrived here!");
        let todayDate = getTodayDateFormatted();
        let todayWords = generateWordSet();
        let todayWordSet = new WordSet(todayDate, minLengthWords, maxLenghtWords, todayWords);

        let jsonWordSetString = JSON.stringify(todayWordSet);
        jsonWordSetString =  "[" + jsonWordSetString + "]";
        fs.writeFileSync(dataDirectory + wordHistoryFile, jsonWordSetString);

    } else {
        let arrWordSet = JSON.parse(jsonWordHistory);
        if (arrWordSet[0].dateCreated !== getTodayDateFormatted()) {
            console.log("The date does not match! Hooray!");
            appendWordSetToHistory(jsonWordHistory);
        }
    }

    res.end(getLatestWordSet());

}


function getLatestWordSet() {
    let jsonObjs = fs.readFileSync(dataDirectory + wordHistoryFile);
    let wordSets = JSON.parse(jsonObjs);
    let jsonString = JSON.stringify(wordSets[0]);
    return jsonString;
}

function appendWordSetToHistory(jsonWord) {
    let wordsInJson = JSON.parse(jsonWord);


    let todayDate = getTodayDateFormatted();
    let todayWords = generateWordSet();
    let todayWordSet = new WordSet(todayDate, minLengthWords, maxLenghtWords, todayWords);

    wordsInJson.unshift(todayWordSet);
    let jsonWordSetString = JSON.stringify(wordsInJson);
    fs.writeFileSync(dataDirectory + wordHistoryFile, jsonWordSetString);
}



/**
 * Get an array of randomly selected words with length ranging from minLengthWords to maxLengthWords.
 * @returns Array with random chosen words.
 */
function generateWordSet() {
    let setWordsReturn = new Array(maxLenghtWords + 1);
    let words = fs.readFileSync("../data/words.txt").toString().replace(/(\n)/gm, "").split("\r");

    // words.sort((a, b) => a.length - b.length);

    words = words.map(word => word.toUpperCase());

    // words = words.filter(word => word.length > 1);

    for (let i = minLengthWords; i <= maxLenghtWords; ++i) {
        let wordArray = words.filter(word => word.length === i);
        setWordsReturn[i] = wordArray[Math.floor(Math.random()*wordArray.length)];
    }
    return setWordsReturn;
}

/**
 * Get the number of days between two dats.
 * @param  dateBefore formatted in "M/D/Y"
 * @param {*} dateCurrent formatted in "M/D/Y"
 * @returns number of days difference
 */
function getDateDifference(dateBefore, dateCurrent) {
    const diffTime = Math.abs(dateCurrent - dateBefore);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Return todays date.
 * @returns String of date formmated in M/D/Y.
 */
function getTodayDateFormatted() {
    let today = new Date();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let year = today.getFullYear();
    return month + "/" + day + "/" + year;
}

class WordSet {
    constructor(dateCreated, minLength, maxLength, arrayWords) {
        this.dateCreated = dateCreated;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.arrayWords = arrayWords;
    }
}



