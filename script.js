const gameContainer = document.getElementById("game");
const scoreBoard = document.querySelector('#score');
const form = document.querySelector('form');

let cards;
let COLORS = [];
let score = 0;
let pairs = 0;
let cardOne;
let cardTwo;

let lowScores = localStorage.getItem('lowScores')
? JSON.parse(localStorage.getItem('lowScores'))
: [];

let lowGuess = localStorage.getItem('lowGuess')
? JSON.parse(localStorage.getItem('lowGuess'))
: [];


document.addEventListener('DOMContentLoaded', setGame)



function setGame() {
  COLORS.length = 0;
  score = 0;
  pairs = 0;

gameContainer.innerHTML = '';

let input = document.createElement('input');
input.type = "text";
input.placeholder = "How many cards?";
let label = document.querySelector('label');
form.appendChild(input);
let button = document.createElement('button');
button.innerText = "Start Game";
form.appendChild(button);

form.addEventListener('submit', function(e) {

  e.preventDefault();

  if(typeof input.value != "Number" && input.value % 2 != 0) {
    label.innerText = "Please selet an even number of cards!";
    form.reset();
    return;
  }
  let cards = input.value;
  for (let i = 0; i < cards /2; i++) {
    let hex = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    COLORS.push(hex);
    COLORS.push(hex);
    // shuffle(COLORS);
  }
  form.innerHTML = '';
  createDivsForColors();
})
}


// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    // temp =
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card


function createDivsForColors(colorArray) {
  gameContainer.innerHTML = '';
  let cardId = 0;
  shuffle(COLORS);

  scoreBoard.innerText = '';
  if(lowScores.length >= 1) {
  const lowScore = document.createElement('p');
  lowScore.innerText = `The lowest score is ${lowScores[0]}`;
  scoreBoard.prepend(lowScore);
  }

  for (let color of COLORS) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    newDiv.setAttribute('id', cardId);
    cardId ++;

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);


    // append the div to the element with an id of game
    gameContainer.append(newDiv);

  }
}

function handleCardClick(event) {

  score ++;
  scoreBoard.innerText = 'Your score: ' + (score);

  if(lowScores.length >= 1) {
    let lowScore = document.createElement('p');
    lowScore.innerText = `The lowest score is ${lowScores[0]} and ${lowGuess[0]} average guess per card.`;
    scoreBoard.prepend(lowScore);
    }

  if (!cardOne) {
    cardOne = event.target;
    cardOne.style.backgroundColor = cardOne.className;
    return;
  }
  if(event.target === cardOne) {
    return;
  }
  if (!cardTwo) {
    cardTwo = event.target;
    cardTwo.style.backgroundColor = cardTwo.className;

    if (cardOne.className === cardTwo.className && cardOne.id != cardTwo.id) {
      pairs ++;
      cardOne.removeEventListener('click', handleCardClick);
      cardTwo.removeEventListener('click', handleCardClick);
      cardOne = undefined;
      cardTwo = undefined;
      console.log(pairs);

      if(pairs >= gameContainer.childElementCount / 2) {
      
        let avgGuess = score/ gameContainer.childElementCount;
        scoreBoard.innerText = `Nice work! Your score is ${score} and your average guess per card is ${avgGuess}.`;


        let br = document.createElement('br');
        scoreBoard.appendChild(br);
        let button = document.createElement('button');
        button.innerText = "Play again?";
        scoreBoard.appendChild(button);
        button.addEventListener('click', function() {

          if(lowScores.length < 1) {
            lowScores.push(score);
            localStorage.setItem('lowScores', JSON.stringify(lowScores));
            }
  
            else if(score < lowScores[0]) {
              lowScores.unshift(score);
              localStorage.setItem('lowScores', JSON.stringify(lowScores));
            }

            if(lowGuess.length <1) {
              lowGuess.push(avgGuess);
              localStorage.setItem('lowGuess', JSON.stringify(lowGuess));
            }
            else if(avgGuess < lowGuess[0]) {
              lowGuess.unshift(avgGuess);
              localStorage.setItem('lowGuess', JSON.stringify(lowGuess));
            }
          location.reload();
        });
      }
      return;
    }
    setTimeout(function() {
      cardOne.style.backgroundColor = 'white';
      cardTwo.style.backgroundColor = 'white';
      cardOne = undefined;
      cardTwo = undefined;
    }, 1000)
  }
}