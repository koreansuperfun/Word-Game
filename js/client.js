const xhttp = new XMLHttpRequest();
const endPoint = "https://letterblock.danyoo.ca/letterblock/js/";
const numColumns = 5;
const numRows = 7;
const cssBorderedSquare = "square-border";
const cssFilledSquare = "square-filled";
const maxLives = 3;
const congratsMessage = "Congratulations! You've finished Level 10!" + "<br>"
+ "<button class=\"btn btn-primary\" onclick=\"startGame()\">Start</button>";

const failedMessage = "You failed! Please Try Again." + "<br>"
+ "<button class=\"btn btn-primary\" onclick=\"startGame()\">Start</button>";
const finalLevel = 7; //MAX 9

let currentLevel = 0;
let currentLetterPos = 0;
let numOfLives = 0;
let arrWords = [];
let positions = setPositionArray();

localStorage.clear();

xhttp.onreadystatechange = function(){
  if (xhttp.readyState == 4) {
    if (xhttp.status == 200) {
        console.log("Arrived at xhttp.status == 200");
        // console.log(this.responseText);
        localStorage.wordSet = this.responseText;
    } else if (xhttp.status == 400) {
        console.log("Arrived at xhttp.status == 400");
    }
  }
};

function fillOtherSquares() {
  for (let i = 0; i < arrWords[currentLevel].length; i++) {
    let position = positions[i];
    let column = Math.floor(position / 5);
    let row = position % 10;
    if (row >=5) {
      row -= 5;
    }
    let idName = column + "-" + row;

    let squareElement = document.getElementById(idName);
    let className = squareElement.getAttribute("class");
    console.log("classname" + className);
    let lastIndex = className.lastIndexOf(" ");
    let newClassName = className.substring(0, lastIndex) + " square-filled";
    squareElement.setAttribute("class", newClassName);
  }
}


function checkStatus(currentSquare) {
  console.log("Letter" + currentSquare.innerHTML);

  if (currentSquare.innerHTML === arrWords[currentLevel].charAt(currentLetterPos)) {
    if (currentLetterPos === 0) {
      fillOtherSquares();

    } else if (currentLetterPos === (arrWords[currentLevel].length - 1) && numOfLives < maxLives) {
      if (currentLevel === finalLevel) {
        let messageSpace = document.getElementById('message');
        messageSpace.innerHTML = '';
        messageSpace.innerHTML = congratsMessage;
        return;
      }

      //Prepare next word for the game.
      console.log("FINISHED LEVEL!");
      currentLetterPos = 0;
      ++currentLevel;
      fillMap();
      return;
    }
    currentSquare.innerHTML = '';
    currentSquare.setAttribute("onclick", "");
    let className = currentSquare.getAttribute("class");
    let lastIndex = className.lastIndexOf(" ");
    currentSquare.setAttribute("class", className.substring(0, lastIndex));

    ++currentLetterPos;

  } else {
    ++numOfLives;
    if (numOfLives >= maxLives) {
      let messageSpace = document.getElementById('message');
        messageSpace.innerHTML = '';
        messageSpace.innerHTML = failedMessage;
        return;
    }
    currentLetterPos = 0;
    let messageSpace = document.getElementById('message');
    messageSpace.innerHTML = '';
    messageSpace.innerHTML = getMessageToDisplay();
    fillMap();
  }


}

const startGame = function() {
  checkLocalStorage();
  checkLocalStorage();

  initGame();
  fillMap();
};

function initGame() {
  currentLevel = 0;
  currentLetterPos = 0;
  numOfLives = 0;
  let objJSON = JSON.parse(localStorage.wordSet);
  arrWords = objJSON.arrayWords;
  // console.log(shuffle(positions));
  positions = shuffle(positions);

}


function fillMap() {
  let messageSpace = document.getElementById("message");
  messageSpace.innerHTML = '';
  messageSpace.innerHTML = getMessageToDisplay();

  let pixelMapDiv = document.getElementById('square');
  pixelMapDiv.innerHTML = '';
  for (let c = 0; c < numColumns; c++) {
      for (let r = 0; r < numRows; r++) {
          let divToAdd = document.createElement('div');
          let className = "square";
          divToAdd.setAttribute("id", r + "-" + c );
          divToAdd.setAttribute("class", className);
          divToAdd.setAttribute("data_c", c);
          divToAdd.setAttribute("data_r", r);
          // divToAdd.setAttribute("onclick", "changeColor(this)");


          pixelMapDiv.appendChild(divToAdd);
      }
  }

  fillLettersInMap();

}

function fillLettersInMap() {
  let currentWord = arrWords[currentLevel];
  for (let i = 0; i < currentWord.length; i++) {
    let position = positions[i];
    let column = Math.floor(position / 5);
    let row = position % 10;
    if (row >=5) {
      row -= 5;
    }
    let idName = column + "-" + row;

    let squareElement = document.getElementById(idName);
    squareElement.innerHTML = currentWord.charAt(i);

    let className = squareElement.getAttribute("class");
    let newClassName = className + " " + cssBorderedSquare;
    squareElement.setAttribute("class", newClassName);
    squareElement.setAttribute("onclick", "checkStatus(this)");
  }
}




function shuffle(array) {
  var i = array.length,
      j = 0,
      temp;

  while (i--) {

      j = Math.floor(Math.random() * (i+1));

      // swap randomly chosen element with current element
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;

  }

  return array;
}

function setPositionArray() {
  let arrReturn = new Array(numColumns * numRows);
  for (let i = 0; i < numColumns * numRows; i++) {
    arrReturn[i] = i;
  }
  return arrReturn;
}


function checkLocalStorage() {
  if (localStorage.wordSet) {
    let objJSON = JSON.parse(localStorage.wordSet);
    let today = getTodayDateFormatted();
    let dateDiff = getDateDifference(objJSON.dateCreated, today);
  
    if (dateDiff >= 24) {
      xhttp.open("GET", endPoint, true);
      xhttp.send();
    }

  } else {
    xhttp.open("GET", endPoint, true);
    xhttp.send();
  }
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

function getMessageToDisplay() {
  return "LEVEL: " + currentLevel + "<br>" + "CURRENT WORD: " + arrWords[currentLevel]
  + "<br>" + "You have " + (3 - numOfLives) + " lives left."
}

/**
 * Get the number of days between two dats.
 * @param  dateBefore formatted in "M/D/Y"
 * @param {*} dateCurrent formatted in "M/D/Y"
 * @returns number of hours difference
 */
 function getDateDifference(dateBefore, dateCurrent) {
  let dateB = new Date(dateBefore);
  let dateC = new Date(dateCurrent);
  const diffTime = dateC.getTime() - dateB.getTime();
  return Math.floor(diffTime / 1000 / 60 / 60);
}
