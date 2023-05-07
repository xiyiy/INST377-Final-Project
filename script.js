function injectHTML(list) { 
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


function getIngre(ingredients) {
  const result = [];
  const percentEstimates = [];

  for (let i = 0; i < ingredients.length; i++) {
    const ingredient = ingredients[i];
    if (!ingredient.hasOwnProperty("has_sub_ingredients") || ingredient.has_sub_ingredients !== "yes") {
      result.push(ingredient.text);
      percentEstimates.push(Math.round(ingredient.percent_estimate * 100) / 100);
    }
  }

  return { text: result, percentEstimates: percentEstimates };
}

function initChart(chart) { //chart, object

  //const { text: text, percentEstimates }  = getIngre(object.product.ingredients)
  
  //console.log(text);
  //console.log(percentEstimates);

  const data = {
    labels: [],
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
      borderWidth: 2,
      data: [],
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
          position: 'bottom',
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
  const { text: text, percentEstimates }  = getIngre(object.product.ingredients)

  chart.data.labels = text; 
  chart.data.datasets.forEach((set) => { 
    set.data = percentEstimates; 
    return set;
  });
  chart.update();
}

function shapeDataForLineChart(array) {
  //reduce can restructure data into a different shape
  return array.reduce((collection, item) => {
    if(!collection[item.category]) {
      collection[item.category] = [item]
    } else {
      collection[item.category].push(item);
    }
    return collection;
  }, {});
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



function updateChart(myChart, object) { //myChart, filteredIngredients, allergy
  const { text: text, percentEstimates }  = getIngre(object.product.ingredients)
  /*const labels = filteredIngredients.map(ingredient => ingredient.text);
  console.log(labels)
  const percentages = filteredIngredients.map(ingredient => ingredient.percent_estimate);
  console.log(percentages)*/

  console.log(text);
  console.log(percentEstimates);

 // myChart.data.datasets[0].label = `Composition of ${allergy}`;

  // Updates the chart's labels based on the filtered ingredients
  myChart.data.labels = text;

  // Updates the chart's data points based on the filtered ingredients
  myChart.data.datasets[0].data = percentEstimates;

  // updates the chart
  myChart.update();
}




/* Main Event */
async function mainEvent() {
  // the async keyword means we can make API requests
  const form = document.querySelector("#main_form"); 
  const inputBarcode = document.querySelector("#barcode");
  const inputAl = document.querySelector("#al");
  const submitBarcode = document.querySelector("#submitBarcode")
  const submitAl = document.querySelector("#submitAl")
  const clearDataButton = document.querySelector("#data_clear");
  
  const chartTarget = document.querySelector('#myChart'); //reference to the html
  const myChart = initChart(chartTarget);

  //localStorage
  const storedData = localStorage.getItem("storedData");

  //click submit for enter barcode
  submitBarcode.addEventListener("click", async (submitEvent) => {
    submitEvent.preventDefault();

    // Convert form into FormData object
    const formData = new FormData(form);
    const formProps = Object.fromEntries(formData);
    
    let barcodeNum = formProps.barcode;
    console.log(barcodeNum);

    /* API data request */
    //const chartData = await getData("737628064502");
    const chartData = await getData(barcodeNum);

    //localStorage setItem
    const storedList = chartData; //???how to check if this is correct 
    localStorage.setItem("storedData", JSON.stringify(storedList));

    console.log(storedList);

    updateChart(myChart, chartData);

    console.log(chartData.product.ingredients)
    console.log(chartData.product.allergens_tags)
  });




  //click submit for enter allergy
  submitAl.addEventListener("click", async (submitEvent) => {
    submitEvent.preventDefault();
    const allergy = submitEvent.target.value

    // Convert form into FormData object
    const formData = new FormData(form);
    const formProps = Object.fromEntries(formData);
    
    let barcodeNum = formProps.barcode;
    console.log(barcodeNum);

    /* API data request */
    //const chartData = await getData("737628064502");
    const chartData = await getData(barcodeNum);

    //localStorage setItem
    const storedList = chartData; //???how to check if this is correct 
    localStorage.setItem("storedData", JSON.stringify(storedList));

    console.log(storedList);



    //filter based on filtered ingredients and allergy input
    const ingredients = chartData.product.ingredients;
    console.log(ingredients)

    const filteredIngredients = ingredients.filter(ingredient => {
      return ingredient.text.toLowerCase() === (allergy.toLowerCase());
    });
    console.log(filteredIngredients)

    updateChart(myChart, filteredIngredients, allergy);

  });
  
  //about me
 
  
  
  //click clear data button
  clearDataButton.addEventListener("click", (event) => {
    console.log("clear browser data");
    localStorage.clear();
    console.log("localStorage Check", localStorage.getItem("storedData"));
  });

}
document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests