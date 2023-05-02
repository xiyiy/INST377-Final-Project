function injectHTML(list) { //working
  console.log("fired injectHTML");
  const target = document.querySelector("#allergy_list");
  target.innerHTML = "";

  list.forEach((item, index) => {
    const str = `${item.substring(3)}`; /* `` bring variable in and render as str*/
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
  //const ingredients = object.ingredients;
  //extracts keys of the object as labels
  //extracts allergens_tags and ingredients

  const ingredients = object.product.ingredients.filter((item) => {
    //do not want repeats of ingredients with sub ingredients
    return !item.has_sub_ingredients && Math.round(item.percent_estimate);
  });

  
  const labels = ingredients.map((item) => item.text);
  console.log(labels)

  const info = ingredients.map((item) => Math.round(item.percent_estimate));

  //const info = Object.values(object.ingredients).map((item) => item.percent_estimate)

  const data = {
    labels: labels,
    datasets: [{
      label: '% of Ingredients',
      backgroundColor: [
        '#277da1',
        '#577590', 
        '#4d908e',
        '#43aa8b',
        '#90be6d',
        '#f9c74f',
        '#f9844a',
        '#f8961e',
        '#f3722c',
        '#f94144'
      ],
      //backgroundColor: ['#283618', '#ffa600', '#ff6361','#bc5090','#58508d','#003f5c'],
      borderWidth: 2,
      data: info
    }]
  };

  const config = {
    type: 'pie',
    data: data,
    options: {
      layout: {
        padding: 15
      },
      plugins: {
        labels: {
          render: 'percentage',
          fontColor: '#FEFAE0',
          fontStyle: 'bolder',
          position: 'outside',
          textMargin: 10
        },
        legend: {
          align: 'center',
          labels: {
            color: '#FEFAE0',
          }
        },
      },
      responsive: true,
      title: {
        display: true,
        text: "% of Ingredients",
      },
    },
    plugins: [ChartDataLabels]
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

    // Convert form into FormData object
    const formData = new FormData(form);
    const formProps = Object.fromEntries(formData);
    
    let barcodeNum = formProps.barcode;
    console.log(barcodeNum);
    /*const chartData = await getData("20753030");
    console.log(chartData)*/

    /* API data request */
    //const chartData = await getData("737628064502");
    const chartData = await getData(barcodeNum);
    console.log(chartData)

    const myChart = initChart(chartTarget, chartData);

    console.log(chartData.product.ingredients)
    console.log(chartData.product.allergens_tags)

    injectHTML(chartData.product.allergens_tags)
  });


  


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