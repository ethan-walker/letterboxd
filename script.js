const inputElement = document.getElementById("data-input");

var ratingArr = ["0", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"]

function stringToDict(str) {
   rows = str.split(/\r\n(?![^"]*",)/).map(row => row.split(/,(?![^"]*",)/));
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
function freqObj(arr) {
   var obj = {};
   arr.forEach(item => {
      if (obj[item]) {
         obj[item] += 1;
      }
      else {
         obj[item] = 1;
      }
   })
   return obj;
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
   return zip.file(filename).async("string").then(data => {
      // console.log(data);
      return stringToDict(data)
   });
}
function handleZip() {
   var zip = new JSZip();
   zip.loadAsync( this.files[0] /* = file blob */)
      .then(function(zip) {
         loadFileContents(zip, "watched.csv").then(handleWatched);

         loadFileContents(zip, "ratings.csv").then(handleRatings);

         loadFileContents(zip, "reviews.csv").then(handleReviews);
      }, function() {alert("Not a valid zip file")});
}

function handleDiary(data) {
   
}
function handleRatings(data) {
   ratings = data.map(row => row.rating);
   avgRating = arrAvg(ratings).toFixed(2);
   document.querySelector(".rating").textContent = "Average Rating: " + avgRating;

   modeRating = mostFrequent(ratings);
   document.querySelector(".mode").textContent = "Most Common Rating: " + modeRating;

   ratingFreq = [];
   ratingArr.forEach((rating, index) => {
      count = ratings.filter(x => x === rating).length;
      ratingFreq[index] = count;
   })
   console.log(ratingFreq);
   const chartData = {
      labels: ratingArr,
      datasets: [{
        label: "Rating",
        data: ratingFreq,
        backgroundColor: 'rgba(255, 99, 132)',
        borderRadius: 5,
       //  borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1
      }]
    };
    const config = {
      type: 'bar',
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
   };
   new Chart("bar-chart", config);
}

function handleWatched(data) {
   years = data.map(row => row.year);
   avgYear = Math.round(arrAvg(years));
   document.querySelector(".release-year").textContent = "Average Release Year: " + avgYear;

   numWatched = data.length;
   document.querySelector(".num-watched").textContent = "Total Watched: " + numWatched;

   yearFreq = freqObj(years);
   const chartData = {
      labels: Object.keys(yearFreq),
      datasets: [{
        label: "Release Year",
        data: Object.values(yearFreq),
        backgroundColor: 'rgba(255, 99, 132)',
        borderRadius: 2,
       //  borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1
      }]
    };
    const config = {
      type: 'bar',
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
   };
   new Chart("release-chart", config);
}
function handleReviews(data) {
   console.log(data);
   numReviewed = data.length;
   document.querySelector(".num-reviewed").textContent = "Total Reviewed: " + numReviewed;
}

Chart.defaults.font.family = "Figtree"
   // ,
   // options: {
   //   legend: {display: false},
   //   scales: {
   //     xAxes: [{ticks: {min: 40, max:160}}],
   //     yAxes: [{ticks: {min: 6, max:16}}],
   //   }
   // }