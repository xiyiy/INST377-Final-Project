/*
  ## Utility Functions
    Under this comment place any utility functions you need - like an inclusive random number selector
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
*/

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }
  
  function injectHTML(list) {
    console.log('fired injectHTML')
    const target = document.querySelector('#restaurant_list');
    target.innerHTML = '';
  
    list.forEach((item, index) => {
      const str = `<li>${item.name}</li>`; /* `` bring variable in and render as str*/
      target.innerHTML += str;
    })
  }
  
  function filterList(list, query){ //query is a value user input
    return list.filter((item) => {
      const lowerCaseName = item.name.toLowerCase();
      const lowerCaseQuery = query.toLowerCase();
      return lowerCaseName.includes(lowerCaseQuery); //includes evaluates == 
    }); 
  }
  
  function cutRestaurantList(list) {
    console.log('fired cut list');
    const range = [...Array(15).keys()]; //makes new array of curr with size 15
    return newArray = range.map((item) => {
      const index = getRandomIntInclusive(0, list.length -1);
      return list[index]
    })
  }
  
  async function mainEvent() { // the async keyword means we can make API requests
    const form = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
    const filterButton = document.querySelector('#filter');
    const loadDataButton = document.querySelector('#data_load');
    const generateListButton = document.querySelector('#generate');
    
    const loadAnimation = document.querySelector('#data_load_animation')
    loadAnimation.style.display = 'none';
  
    let currentList = [];
    
    loadDataButton.addEventListener('click', async (submitEvent) => { // async has to be declared on every function that needs to "await" something
      console.log('Loading data'); // this is substituting for a "breakpoint"
      loadAnimation.style.display = 'inline-block';
  
      //get request to control results
      const results = await fetch('https://world.openfoodfacts.org/api/v0/product/737628064502.json');
  
      // This changes the response from the GET into data we can use - an "object"
      currentList = await results.json();
      
      loadAnimation.style.display = 'none';
      console.table(currentList); // this is called "dot notation"
    });
  
    filterButton.addEventListener('click', (event) => {
      console.log('clicked FilterButton');
  
      const formData = new FormData(form);
      const formProps = Object.fromEntries(formData);
  
      console.log(formProps);
      const newList = filterList(currentList, formProps.resto);
  
      console.log(newList);
      injectHTML(newList);
    })
  
    generateListButton.addEventListener('click', (event) => {
      console.log('generate new list');
      const restaurantsList = cutRestaurantList(currentList);
      //console.log(restaurantsList);
      injectHTML(restaurantsList);
    })
  }
  //add event listener
  document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests