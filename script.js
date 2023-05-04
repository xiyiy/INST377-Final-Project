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

function initChart(chart, object) {
  //extracts keys of the object as labels
  //extracts allergens_tags and ingredients

  
  
  const { text: text, percentEstimates }  = getIngre(object.product.ingredients)
  
  //console.log(text);
  //console.log(percentEstimates);


/*const ingredients = object.product.ingredients.filter((item) => {
    //do not want repeats of ingredients with sub ingredients
    return !item.has_sub_ingredients && Math.round(item.percent_estimate);
  });
  const labels = ingredients.map((item) => item.text);
  const info = ingredients.map((item) => Math.round(item.percent_estimate));
*/  

  const data = {
    labels: text,
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
      data: percentEstimates
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

/* Main Event */
async function mainEvent() {
  // the async keyword means we can make API requests
  const form = document.querySelector("#main_form"); 
  const inputBarcode = document.querySelector("#barcode");
  const inputAl = document.querySelector("#al");
  const submitBarcode = document.querySelector("#submitBarcode")
  const submitAl = document.querySelector("#submitAl")
  const clearDataButton = document.querySelector("#data_clear");
  const chartTarget = document.querySelector('#myChart')


  //localStorage
  const storedData = localStorage.getItem("storedData");
  //let parsedData = JSON.parse(storedData); //???dont need I think...


  //click submit for enter barcode
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

    //localStorage setItem
    const storedList = chartData; //???how to check if this is correct 
    localStorage.setItem("storedData", JSON.stringify(storedList));
    //parsedData = storedList;

    console.log(storedList);

    const myChart = initChart(chartTarget, chartData);

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
    /*const chartData = await getData("20753030");
    console.log(chartData)*/

    /* API data request */
    //const chartData = await getData("737628064502");
    const chartData = await getData(barcodeNum);

    //localStorage setItem
    const storedList = chartData; //???how to check if this is correct 
    localStorage.setItem("storedData", JSON.stringify(storedList));
    //parsedData = storedList;

    console.log(storedList);

    //???changechart
    /*if (chartData.product.allergens_tags.includes(allergy)) {
      //gets pie chart with just allergen and percent of ingredients in product
      console.log("true")
      const myChart = changeChart(chartTarget, chartData); 
      injectHTML(chartData.product.allergens_tags)
    } else {
      console.log("false")
      const myChart = initChart(chartTarget, chartData); 
    }
    */
    const { text: text }  = getIngre(object.product.ingredients)
    text.forEach((item) => {
      if (item == allergy) {
        console.log("true")
        //gets pie chart with just allergen and percent of ingredients in product
        changeChart(myChart, chartData); 
        injectHTML(chartData.product.allergens_tags);
        //allergyFound = true;
      } else {
        console.log("false")
        initChart(myChart, chartData); 
      }
    })
    
  });

    

    //injectHTML(chartData.product.allergens_tags)
  
  
  //click clear data button
  clearDataButton.addEventListener("click", (event) => {
    console.log("clear browser data");
    localStorage.clear();
    console.log("localStorage Check", localStorage.getItem("storedData"));
  });


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
 /* inputAl.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    
    
   });
*/  
}
document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests