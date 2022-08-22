const xhttp = new XMLHttpRequest();
const endPoint =
  "http://localhost:9001";

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

