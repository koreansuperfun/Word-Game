const xhttp = new XMLHttpRequest();
const endPoint = "http://localhost:9001";
const numColumns = 5;
const numRows = 7;

xhttp.onreadystatechange = function(){
  if (xhttp.readyState == 4) {
    if (xhttp.status == 200) {
        console.log("Arrived at xhttp.status == 200");
        console.log(this.responseText);
    } else if (xhttp.status == 400) {
        console.log("Arrived at xhttp.status == 400");
    }
  }
};

const searchForWord = function() {

  xhttp.open("GET", endPoint, true);
  xhttp.send();
};


function fillMap() {
  let pixelMapDiv = document.getElementById('square');
  pixelMapDiv.innerHTML = '';
  for (let c = 0; c < numColumns; c++) {
      for (let r = 0; r < numRows; r++) {
          let divToAdd = document.createElement('div');
          let className = "pos" + c + "-" + r + " square";
          divToAdd.setAttribute("id", "id");
          divToAdd.setAttribute("class", className);
          divToAdd.setAttribute("data_c", c);
          divToAdd.setAttribute("data_r", r);
          divToAdd.setAttribute("onclick", "changeColor(this)");

          pixelMapDiv.appendChild(divToAdd);
      }
  }
}
