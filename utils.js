const arrAvg = (arr) => {
   arr = arr.filter(item => item !== "")
   return arr.reduce((acc, curr) => parseFloat(acc) + parseFloat(curr)) / arr.length;
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

function arrFromRange(start, end, step = 1, asString = true) {
   function* genNum() {
      for (let i = start; i <= end; i+=step) yield asString ? i.toString() : i;
    }
    
   return [...genNum()];
}

function GET_CONTINUOUS_VALUES(arr, step = 1) {
   arr = [...new Set(arr)].filter(x => x !== ""); // remove duplicates and blank
   return arrFromRange(Math.min(...arr), Math.max(...arr), step)
}

function MAP_FREQS(arr, values) {
   var res = [];
   values.forEach((value, index) => {
      count = arr.filter(x => x === value).length || 0;
      res[index] = count;
   })
   return res;
}