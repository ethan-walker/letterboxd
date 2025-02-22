const inputElement = document.getElementById("data-input");

function stringToDict(str) {
   rows = str.split("\r\n").map(row => row.split(/(?!\B"[^"]*),(?![^"]*"\B)/));
   header = rows[0].map(item => item.toLowerCase());
   rows = rows.slice(1);
   grid = rows.map(row => {
      let dict = {};
      row.forEach((item, index) => {
         dict[header[index]] = item;
      })
      return dict;
   });
   return grid.slice(0, -1);
}
const arrAvg = (arr) => {
   arr = arr.filter(item => item !== "")
   return arr.reduce((acc, curr) => parseFloat(acc) + parseFloat(curr)) / arr.length;
}

const mostFrequent = arr =>
   Object.entries(
     arr.reduce((a, v) => {
       a[v] = (a[v] ?? 0) + 1;
       return a;
     }, {})
   ).reduce((a, v) => (v[1] >= a[1] ? v : a), [null, 0])[0];

inputElement.onchange = handleZip;

// function() {
//    var zip = new JSZip();
//    zip.loadAsync( this.files[0] /* = file blob */)
//       .then(function(zip) {
//           console.log(zip);
//          //  const reader = new FileReader();
//          //  reader.readAsText(diary);
      
// };
async function loadFileContents(zip, filename) {
   return zip.file(filename).async("string").then(data => stringToDict(data));
}
function handleZip() {
   var zip = new JSZip();
   zip.loadAsync( this.files[0] /* = file blob */)
      .then(function(zip) {
         loadFileContents(zip, "watched.csv").then(handleWatched);

         loadFileContents(zip, "ratings.csv").then(handleRatings);
      }, function() {alert("Not a valid zip file")});
}

function handleDiary(data) {
   
}
function handleRatings(data) {
   console.log(data);
   ratings = data.map(row => row.rating);
   console.log(ratings);
   avgRating = arrAvg(ratings).toFixed(2);
   document.querySelector(".rating").textContent = "Average Rating: " + avgRating;

   modeRating = mostFrequent(ratings);
   document.querySelector(".mode").textContent = "Most Common Rating: " + modeRating;
}

function handleWatched(data) {
   years = data.map(row => row.year);
   console.log(years);
   avgYear = Math.round(arrAvg(years));
   document.querySelector(".release-year").textContent = "Average Release Year: " + avgYear;
}