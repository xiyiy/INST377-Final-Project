function injectHTML(list) { //working
  console.log("fired injectHTML");
  const target = document.querySelector("#allergy_list");
  target.innerHTML = "";

  list.forEach((item, index) => {
    const str = `${item}`; /* `` bring variable in and render as str*/
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
  //extracts keys of the object as labels
  //extracts allergens_tags and ingredients
  const labels = Object.keys(object);
//  const labels = [Object.keys(object.allergens_tags), Object.keys(object.ingredients)];
  console.log(labels)
/*
  const alCount = object.allergens_tags.reduce((acc, curr) => acc + curr.length, 0);
  const ingCount = object.ingredients.reduce((acc, curr) => acc + curr.length, 0);

const info = [Object.keys(object).map((item) => object[item].length), alCount, ingCount]; */

  const info = Object.keys(object).map((item) => object[item].length);

  const data = {
    labels: labels,
    datasets: [{
      label: 'Count of Ingredients and Allergens',
      backgroundColor: '#283618',
      borderWidth: '1',
      data: info
    }]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      indexAxis: 'y',
      label: {
        color: 'rgb(254,250,224)'
      },
      scales: {
        x: {
          ticks: {
            color: 'rgb(254,250,224)'
          }
        },
        y: {
          ticks: {
            color: 'rgb(254,250,224)'
          }
        }
      },
    }
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

function shapeData(array) { //only get ingredients and allergens no length 
  const ingredients = array.product.ingredients
  //const allergens = array.product.allergens_tags
  const allergens = array.product.allergens_tags.filter(tag => tag.startsWith("en:"))
}

async function getData(barcodeNum) {
  //retrieves product info based on barcode
  const url = `https://world.openfoodfacts.org/api/v0/product/${barcodeNum}.json`;
  const data = await fetch(url, {
    method : "GET",
  });
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

  submitBarcode.addEventListener("click", async (submitEvent) => {
    submitEvent.preventDefault();
    console.log("retrieve bracode")

    // Convert form into FormData object
    const formData = new FormData(form);
    const formProps = Object.fromEntries(formData);
    
    let barcodeNum = formProps.barcode;
    console.log(barcodeNum);
    /*const chartData = await getData("20753030");
    console.log(chartData)*/

    /* API data request */
    //how to do it without hard coding code 
    //!!!insert parameter into enter barcode to view on console //
    //const chartData = await getData("737628064502");
    const chartData = await getData(barcodeNum);
    console.log(chartData)
    
    /*const shapedData = shapeData(chartData);
    console.log(shapedData);

    const myChart = initChart(chartTarget, chartData);*/
  });

/*
  
*/
  
  //console.log(myChart)

  //console.log(chartData.product.ingredients)
  //console.log(chartData.product.allergens_tags)

  //injectHTML(chartData.product.allergens_tags)

  /*
  let currentArray;
  form.addEventListener('submit', (submitEvent) => {
    const barcodeNum = submitEvent.target.value
    const getBarcode = getData(barcodeNum)
    //const getBarcode = getData(barcodeNum)
    console.log(getBarcode);

    submitEvent.preventDefault();
    //currentArray = processData(chartData);
    
  //  const alByBarcode = currentArray.filter((item) => Boolean(item.code));
  //  injectHTML(alByBarcode);

  //  const localData = shapeData(chartData);
  //  changeChart(myChart, localData);
  //  console.log(arrayFromJson);
  });
*/ 

  /*inputBarcode.addEventListener("input", (event) => {
    //filter does nothing until something exists
    //const barcodeNum = submitEvent.target.value

    if (!currentArray.length) { return; }
    console.log(currentArray)

    //filter by barcode
    const alByBarcode = currentArray
      .filter((item) => Boolean(item.code));

    if (alByBarcode.length > 0) {
      injectHTML(alByBarcode);
    }
  });
*/

  /*form.addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();
    currentArray = processData(chartData);
    
    //allergen_tags in product
    const alByBarcode = currentArray.filter((item) => Boolean(item.product.get(allergens_tags)));
    injectHTML(alByBarcode);

 //   const localData = shapeData(chartData);
    changeChart(myChart, localData);
  });
*/
  inputAl.addEventListener("input", (event) => {
    if (!currentArray.length) { return; }
    console.log(currentArray)

    //filter by allergens_tags
    const alByBarcode = currentArray
      .filter((item) => Boolean(item.product.allergens_tags));
    
     if (alByBarcode.length > 0) {
       injectHTML(alByBarcode);
     }
   });
   
}
document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests