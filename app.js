//Test connecting
console.log("js is connected!")

//DOM Objects
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFront = document.querySelector('.poke-front-image');
const pokeBack = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeListItems = document.querySelectorAll('.list-item');
const prevButton = document.querySelector('.left-button');
const nextButton = document.querySelector('.right-button');


//checking queryselector works
console.log(pokeName);
console.log(pokeId);
console.log(pokeFront);
console.log(pokeBack);
console.log(pokeTypeOne);
console.log(pokeTypeTwo);
console.log(pokeWeight);
console.log(pokeHeight);
console.log(pokeListItems)


// Variables

    //To stop me typing out all 18 types over and over again
const allTypes = ['fire', 'water', 'grass', 
        'electric', 'rock', 'ground', 
        'ghost', 'bug', 'fighting', 
        'psychic', 'flying', 'normal', 
        'dark', 'steel', 'dragon', 
        'ice', 'fairy', 'poison'
    ];

let prevUrl = null

let nextUrl = null

// Functions

//to reset screen upon button press
function resetScreen(){
    mainScreen.classList.remove('hide');
    for(const type of allTypes) {
        mainScreen.classList.remove(type)
    };
};


//API pulls lower case data down, so function to capatilise
function capitalise(str){
    return str[0].toUpperCase() + str.substr(1)
};


//Function for Right Side of Screen fetch - limiting to 20 entries p/page
function fetchRightList(url){
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const result = data['results']
            prevUrl = data['previous']
            nextUrl = data['next']

    //for loop to gather names for right side buttons
            for (let i = 0; i < pokeListItems.length; i++) {
                const listItem = pokeListItems[i];
                const dataResult = result[i];

                if (dataResult) {
                //get name portion
                    const pokeName = dataResult['name'];
                //get url
                    const pokeUrl = dataResult['url']
                //split url by /
                    const urlArray = pokeUrl.split('/')
                //grab 6th element which is the number in the dex
                    const id = urlArray[urlArray.length - 2];
                    console.log(urlArray)
                    listItem.textContent = id + '. ' + capitalise(pokeName)
            }   else{
                    listItem.textContent = ''
            }
        }
    });
};

function fetchPokeData(id){
    //Left side of screen
    fetch (`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(response => {
    return response.json();
})
    .then(data => {

//logging just so I can refer to the API data
        console.log(data);

//calling the resetscreen function
        resetScreen();

//Collect and process the type data
        const typesData = data['types'];
        const typeOne = typesData[0];
        const typeTwo = typesData[1];
        pokeTypeOne.textContent = capitalise(typeOne['type']['name']);

//hiding the type two entry if it does not exist
        if (typeTwo) {
            pokeTypeTwo.classList.remove('hide');
            pokeTypeTwo.textContent = capitalise(typeTwo['type']['name']);
    }   else {
            pokeTypeTwo.classList.add('hide');
            pokeTypeTwo.textContent = '';
    }
//Adding type as a class to change background colour
        mainScreen.classList.add(typeOne['type']['name']);

//Pokemon Name
        pokeName.textContent = capitalise(data['name']);

//Using Padding in order to always have the id be 3 digits
        pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');

//Height and Weight data collection
        pokeWeight.textContent = data['weight'];
        pokeHeight.textContent = data['height'];


//Image collection from API
        pokeFront.src = data['sprites']['front_default'] || '';
        pokeBack.src = data['sprites']['back_default'] || '';
    });
}


//Function for next button
function handleNextButtonClick(){
    if(nextUrl) {
        fetchRightList(nextUrl)
    }
}
//Function for previous button
function handlePrevButtonClick(){
    if(prevUrl) {
        fetchRightList(prevUrl)
    }
}

function handleListItemClick(e){
    if(!e.target) return;

    const listItem = e.target;
    if(!listItem.textContent) return;

    const id = listItem.textContent.split('.')[0];
    fetchPokeData(id);
}
//API

//Event Listeners

prevButton.addEventListener('click', handlePrevButtonClick);
nextButton.addEventListener('click', handleNextButtonClick);

for(const listItem of pokeListItems){
    listItem.addEventListener('click', handleListItemClick)
}

//initialise App

fetchRightList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');

