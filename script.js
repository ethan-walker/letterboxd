const inputElement = document.getElementById("data-input");

Chart.defaults.backgroundColor = CHART_COLOUR;
Chart.defaults.font.family = "Figtree";

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
   return grid.slice(0, -1); // remove header
}


const mostFrequent = arr =>
   Object.entries(
     arr.reduce((a, v) => {
       a[v] = (a[v] ?? 0) + 1;
       return a;
     }, {})
   ).reduce((a, v) => (v[1] >= a[1] ? v : a), [null, 0])[0];

inputElement.onchange = handleZip;

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

   var ratingCats = {"positive" : 0, "neutral": 0, "negative": 0}
   
   ratings.forEach(rating => {
      rating = parseFloat(rating);
      if (rating === 2.5) {
         ratingCats.neutral++;;
      }
      else if (rating > 2.5) {
         ratingCats.positive++;
      }
      else {
         ratingCats.negative++;
      }
   })
   console.log(ratingCats);
   // CHART MAKING
   
   ratingFreq = MAP_FREQS(ratings, RATING_LABELS);

   const chartData = {
      labels: RATING_LABELS,
      datasets: [{
        label: "Rating",
        data: ratingFreq,
        borderRadius: 5,
        categoryPercentage: 0.9
      }]
    };
    const config = {
      type: 'bar',
      data: chartData,
      options: {}
   };
   new Chart("bar-chart", config);

   // RATING BY DECADE

   years = REMOVE_BLANK(data.map(row => row.year));
   yearAndRating = data.map(row => { return {"year" : row.year, "rating" : row.rating}})
      .filter(x => x.year !== "");
   console.log(yearAndRating);

   minYear = Math.min(...years);
   maxYear = Math.max(...years);
   minDecade = GET_DECADE(minYear);
   maxDecade = GET_DECADE(maxYear);

   decadeList = arrFromRange(minDecade, maxDecade, 10);
   decadeFreq = [];
   decadeList.forEach((decade, index) => {
      decadeRatings = yearAndRating.filter(x => GET_DECADE(x.year) === parseInt(decade))
         .map(x => x.rating);
      if(decadeRatings.length !== 0) {
         avgRating = arrAvg(decadeRatings).toFixed(2);
         decadeFreq[index] = avgRating;
      }
   });
   console.log(decadeFreq);

   const decadeData = {
      labels: decadeList.map(decade => decade + "s"),
      datasets: [{
        label: "Avg. Rating",
        data: decadeFreq,
        borderRadius: 2,
        categoryPercentage: 0.95,
        skipNull: false
      }]
   };
   const decadeConfig = {
      type: 'bar',
      data: decadeData,
      options: {}
   };
   new Chart("decade-chart", decadeConfig);
}

// WATCHED.CSV DATASET
// Contains:
//    - NAME
//    - RELEASE YEAR
//    - DATE ADDED TO LETTERBOXD (NOT DATE WATCHED)
//    - LINK

function handleWatched(data) {
   years = REMOVE_BLANK(data.map(row => row.year));

   avgYear = Math.round(arrAvg(years));
   document.querySelector(".release-year").textContent = "Average Release Year: " + avgYear;

   numWatched = data.length;
   document.querySelector(".num-watched").textContent = "Total Watched: " + numWatched;

   yearLabels = GET_CONTINUOUS_VALUES(years);
   yearFreq = MAP_FREQS(years, yearLabels);

   const chartData = {
      labels: yearLabels,
      datasets: [{
        label: "# Films",
        data: yearFreq,
        borderRadius: 2,
        categoryPercentage: 0.95,
        skipNull: false
      }]
   };
   const config = {
      type: 'bar',
      data: chartData,
      options: {}
   };
   new Chart("release-chart", config);

}
function handleReviews(data) {
   numReviewed = data.length;
   document.querySelector(".num-reviewed").textContent = "Total Reviewed: " + numReviewed;
}