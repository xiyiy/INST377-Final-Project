/*
  ## Utility Functions
    Under this comment place any utility functions you need - like an inclusive random number selector
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
*/

function injectHTML(list) {
  console.log("fired injectHTML");
  const target = document.querySelector("#allergy_list");
  target.innerHTML = "";

  list.forEach((item, index) => {
    const str = `${item.allergens_tags}`; /* `` bring variable in and render as str*/
    target.innerHTML += str;
  });
}

/*function processData(list, query) {
  //query is a value user input
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery); //includes evaluates ==
  });
}*/

/*function cutRestaurantList(list) {
  console.log("fired cut list");
  const range = [...Array(15).keys()]; //makes new array of curr with size 15
  return (newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length - 1);
    return list[index];
  }));
}*/

/*function initMap() {
  const carto = L.map("map").setView([38.98, -76.93], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(carto);
  return carto;
}*/

/*function markerPlace(array, map) {
  console.log("array for markers", array);

  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });

  array.forEach((item) => {
    console.log("Barcode", item);
    const { coordinates } = item.code;
    L.marker([coordinates[1], coordinates[0]]).addTo(map);
  });
}*/

function initChart(chart, object) {
  //gets count of keys
  const labels = Object.keys(object);
  const info = Object.keys(object).map((item) => object[item].length);

  const data = {
    labels: labels,
    datasets: [{
      label: 'Product Count by Allergen',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: info
    }]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {}
  };

  return new Chart(
    chart,
    config
  );

}

function changeChart(chart, dataObject) {
  const labels = Object.keys(dataObject);
  const info = Object.keys(dataObject).map((item) => dataObject[item].length);

  chart.data.labels = labels; 
  chart.data.datasets.forEach((set) => { 
    set.data = info; 
    return set;
  });
  chart.update();
}

function shapeData(array) { //get length

  const ingredientsLen = array.product.ingredients.length
  const allergensLen = array.product.allergens_tags
}

async function getData(barcode) { //filter data with just code and product
  const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
  const data = await fetch(url, {
    method : "GET"
  })
  const json = await data.json();
  //const reply = json.filter((item) => Boolean(item.code)).filter((item) => Boolean(item.product));
  return json;
}

/* Main Event */
async function mainEvent() {
  // the async keyword means we can make API requests
  const form = document.querySelector("#main_form"); 
  const inputBarcode = document.querySelector("#barcode");
  const inputAl = document.querySelector("#al");
  const submitBarcode = document.querySelector("#submitBarcode")
  const submitAl = document.querySelector("#submitAl")
  const chartTarget = document.querySelector('#myChart')

  /*const chartData = await getData("20753030");
  console.log(chartData)*/




  /* API data request */
  //how to do it without hard coding code 
  //!!!insert parameter into enter barcode to view on console //
  const chartData = await getData("737628064502");
  //const chartData = await getData(inputBarcode);
  



  //const shapedData = shapeData(chartData);
  //console.log(shapedData);
  //const myChart = initChart(chartTarget, shapedData);
 
  /*const results = await fetch(
    "https://world.openfoodfacts.org/api/v0/product/${barcode}.json"
  );
  const arrayFromJson = await results.json();
  console.log(arrayFromJson);*/
  console.log(chartData.product.ingredients)
  console.log(chartData.product.allergens_tags)

  let currentArray;
  form.addEventListener('submit', (submitEvent) => {
    const barcodeNum = submitEvent.target.value
    const getBarcode = getData(barcodeNum)
    console.log(getBarcode);

    submitEvent.preventDefault();
    //currentArray = processData(chartData);
    
  //  const alByBarcode = currentArray.filter((item) => Boolean(item.code));
  //  injectHTML(alByBarcode);

  //  const localData = shapeData(chartData);
  //  changeChart(myChart, localData);
  //  console.log(arrayFromJson);
  });

  /*inputBarcode.addEventListener("input", (event) => {
    //filter does nothing until something exists
    if (!currentArray.length) { return; }
    console.log(currentArray)

    //filter by barcode
    const alByBarcode = currentArray
      .filter((item) => Boolean(item.code));

    if (alByBarcode.length > 0) {
      injectHTML(alByBarcode);
    }
  });*/

  form.addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();
    currentArray = processData(chartData);
    
    //allergen_tags in product
    const alByBarcode = currentArray.filter((item) => Boolean(item.product.get(allergens_tags)));
    injectHTML(alByBarcode);

 //   const localData = shapeData(chartData);
    changeChart(myChart, localData);
  });

  inputAl.addEventListener("input", (event) => {
    if (!currentArray.length) { return; }
    console.log(currentArray)

    //filter by allergens_tags
    const alByBarcode = currentArray
      .filter((item) => Boolean(item.product.get(allergens_tags)));
    
     if (alByBarcode.length > 0) {
       injectHTML(alByBarcode);
     }
   });

   /* testing 
   form.addEventListener('submit', (submitEvent) => {
     submitEvent.preventDefault();
    
     //barcode submit
     if(submitEvent.target === submitBarcode){
       const chartData = await getData()
     }
     const inputBarcode = submitEvent.target.elements["barcode"]
     const inputAl = submitEvent.target.elements["allergy"]
    
     if(submitEvent.submitType.name === "submitBarcode"){
       const barcode = inputBarcode.value;
     }
     currentArray = processData(chartData);
    
     const alByBarcode = currentArray.filter((item) => Boolean(item.product.get(allergens_tags)));
     injectHTML(alByBarcode);

     const localData = shapeData(chartData);
     changeChart(myChart, localData);
   });*/

}
//add event listener
document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests