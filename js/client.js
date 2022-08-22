const xhttp = new XMLHttpRequest();
const endPoint = "http://localhost:9002";
const numColumns = 5;
const numRows = 7;
const cssBorderedSquare = "square-border";
const cssFilledSquare = "square-filled";

let currentLevel = 0;
let currentLetterPos = 0;
let arrWords = [];
let positions = setPositionArray();


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

const startGame = function() {
  checkLocalStorage();

  currentLevel = 0;
  let objJSON = JSON.parse(localStorage.wordSet);
  arrWords = objJSON.arrayWords;
  console.log(shuffle(positions));
  positions = shuffle(positions);

  fillMap();
};


function fillMap() {
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
  console.log("arrived here!");
  let currentWord = arrWords[currentLevel];
  console.log(currentWord);
  for (let i = 0; i < currentWord.length; ++i) {
    let position = positions[i];
    let column = Math.floor(position / 5);
    let row = position % 10;
    if (row >=5) {
      row -= 5;
    }
    let idName = column + "-" + row;
    console.log("id name " + idName);

    let squareElement = document.getElementById(idName);
    squareElement.innerHTML = currentWord.charAt(i);

    let className = squareElement.getAttribute("class");
    let newClassName = className + " " + cssBorderedSquare;
    squareElement.setAttribute("class", newClassName);
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
  for (let i = 0; i < numColumns * numRows; ++i) {
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
