function injectHTML(list) { 
  console.log("fired injectHTML");
  const target = document.querySelector("#allergy_list");
  target.innerHTML = "";

  list.forEach((item) => {
    const str = `${item.text}`; /* `` bring variable in and render as str*/
    target.innerHTML += str;
  });
}

function noAllergy() { 
  const target = document.querySelector("#allergy_list");
  target.innerHTML += "Allergen Not Found";
}

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


function initChart(chart) {
//declaring an empty chart with no labels or data

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
        /*labels: {
          render: 'percentage',
          fontColor: '#FEFAE0',
          fontStyle: 'bolder',
          position: 'outside',
          textMargin: 10
        },*/
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
    //plugins: [ChartDataLabels]
  };

  return new Chart(
    chart,
    config
  );

}


function changeBarcodeChart(chart, object) {
  const { text: text, percentEstimates }  = getIngre(object.product.ingredients)

  chart.data.labels = text; 
  chart.data.datasets.forEach((set) => { 
    set.data = percentEstimates; 
    return set;
  });
  chart.update();
}


function changeAllergyChart(myChart, filteredIngredients, allergy) { 
  const labels = filteredIngredients.map(ingredient => ingredient.text);
  console.log(labels)

  const percentages = filteredIngredients.map(ingredient => ingredient.percent_estimate);
  console.log(percentages)

  myChart.data.datasets[0].label = `Composition of ${allergy}`;

  // Updates the chart's labels based on the filtered ingredients
  myChart.data.labels = labels;

  // Updates the chart's data points based on the filtered ingredients
  myChart.data.datasets[0].data = percentages;

  // updates the chart
  myChart.update();
}

/*function changeBGColor() {
  const speechBubble = document.querySelector("#bubble")
  speechBubble.style.backgroundColor = "#ff0000"
}
*/

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
  const inputAl = document.querySelector("#al");
  const submitBarcode = document.querySelector("#submitBarcode")
  const submitAl = document.querySelector("#submitAl")
  const clearDataButton = document.querySelector("#data_clear");
 
  //page layout
  const chartArea = document.querySelector("#hidden")
  const speechBubble = document.querySelector("#bubble")
  const hiddenText1 = document.querySelector("#hiddenText1")
  const hiddenText2 = document.querySelector("#hiddenText2")
  
  //reference to the html location
  const chartTarget = document.querySelector('#myChart'); 
  const myChart = initChart(chartTarget);

  //localStorage
  const storedData = localStorage.getItem("storedData");

  hiddenText1.classList.remove("hidden");

  //click submit for enter barcode
  submitBarcode.addEventListener("click", async (submitEvent) => {
    submitEvent.preventDefault();

    // Convert form into FormData object
    const formData = new FormData(form);
    const formProps = Object.fromEntries(formData);
    
    let barcodeNum = formProps.barcode;
    console.log(barcodeNum);

    /* API data request */
    const chartData = await getData(barcodeNum);

    //localStorage setItem
    const storedList = chartData;
    localStorage.setItem("storedData", JSON.stringify(storedList));
    console.log(storedList);

    chartArea.classList.remove("hidden");
    //hiddenText1.classList.remove("hidden");

    changeBarcodeChart(myChart, chartData);

    console.log(chartData.product.ingredients)
    //console.log(chartData.product.allergens_tags)
  });


  //click submit for enter allergy
  submitAl.addEventListener("click", async (submitEvent) => {
    submitEvent.preventDefault();

    //allergy input
    const allergy = inputAl.value

    // Convert form into FormData object
    const formData = new FormData(form);
    const formProps = Object.fromEntries(formData);
    
    let barcodeNum = formProps.barcode;
    console.log(barcodeNum);

    /* API data request */
    const chartData = await getData(barcodeNum);

    const storedList = chartData;
    localStorage.setItem("storedData", JSON.stringify(storedList));
    //console.log(storedList);

    //filter based on filtered ingredients and allergy input
    const ingredients = chartData.product.ingredients;
    //console.log(ingredients)

    const filteredIngredients = ingredients.filter(ingredient => {
      return ingredient.text.toLowerCase().includes(allergy.toLowerCase());
    });

    if(filteredIngredients.length > 0){
      injectHTML(filteredIngredients);
      chartArea.classList.remove("hidden");
      speechBubble.style.backgroundColor = "#ff0000"
      hiddenText1.classList.add("hidden");
      hiddenText2.classList.remove("hidden");
    } else {
      noAllergy();
      chartArea.classList.add("hidden");
    }
    

    changeAllergyChart(myChart, filteredIngredients, allergy);
  });

  
  //click clear data button
  clearDataButton.addEventListener("click", (event) => {
    console.log("clear browser data");
    localStorage.clear();
    console.log("localStorage Check", localStorage.getItem("storedData"));
  });

}
document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests