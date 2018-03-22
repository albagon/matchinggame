/**
* Create a list that holds all of your cards
*/
const iconClasses = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
let openCards = [];

// The number of moves
let moveCounter = 0;

// The timer status
let timerGoing = false;

// The value of the timer
let timerValue = 0;

// The timer interval
let timerInterval = null;

// Get the button that opens the modal
// TODO: Remove this button once testing is complete
const btn = document.getElementById('myBtn');


function createListOfCards(array) {
    let cards = [];

    array.forEach(function(item) {
        let i = 1;
        while (i <= 2){
            const newCard = document.createElement('li');
            newCard.classList.add('card');
            const newIcon = document.createElement('i');
            newIcon.classList.add('fa', item, 'rotate-y-minus-180');
            newCard.appendChild(newIcon);
            // Here is where I add the event listener to each card
            newCard.addEventListener('click', playGame);
            cards.push(newCard);
            i++;
        }
    });
    return cards;
}

/**
* Display the cards on the page
*   - shuffle the list of cards using the provided "shuffle" method below
*   - loop through each card and create its HTML
*   - add each card's HTML to the page
*/

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function createDeck() {
    const listOfCards = shuffle(createListOfCards(iconClasses));
    const fragment = document.createDocumentFragment();
    const deck = document.querySelector('.deck');

    deck.innerHTML = '';

    listOfCards.forEach(function(item) {
        fragment.appendChild(item);
    });

    deck.appendChild(fragment);
}

function playGame(e) {
    //The timer starts
    if (timerGoing === false) {

        startTimer();
    }

    //Lock card
    lockCard(e.target);
    //Open card
    e.target.classList.add('open', 'show');
    //Add open card to openCards array
    openCards.push(e.target);
    //Log to the console the list of open cards
    console.log('list of open cards ' + openCards);   // TODO: erase this line after testing is complete

    if (openCards.length % 2 === 0) {
        if (openCards[openCards.length-2].firstChild.classList.contains(openCards[openCards.length-1].firstChild.classList.item(1))) {
            console.log('the player has a match');    // TODO: erase this line after testing is complete
            updateMoves();
            console.log('moves equals ' + moveCounter);
            if (openCards.length === 16) {
                stopTimer(timerInterval);
                popUpModal();
            }
        } else {
            // TODO: erase next line after testing is complete
            console.log('no match, call noMatch ' + openCards[openCards.length-2].firstChild.classList + openCards[openCards.length-1].firstChild.classList);

            // Wait for the transition to finish
            const delayInMilliseconds = 400; // 400 milliseconds
            setTimeout(function() {
                // code to be executed after 400 milliseconds
                noMatch(openCards[openCards.length-1], openCards[openCards.length-2]);
            }, delayInMilliseconds);
            updateMoves();
            console.log('moves equals ' + moveCounter);

        }

    }

}

/**
* No match functions
*/

function noMatch(card1, card2) {
    card1.classList.add('no-match');
    card2.classList.add('no-match');

    // Wait for the transition to finish
    const delayInMilliseconds = 500; // 500 milliseconds
    setTimeout(function() {
        // code to be executed after 500 milliseconds
        closeCards(card1, card2);
    }, delayInMilliseconds);

}

function closeCards(card1, card2) {
    console.log('inside closeCards');
    card1.classList.remove('open', 'show', 'no-match');
    card2.classList.remove('open', 'show', 'no-match');
    removeCards(card1, card2);
}

function removeCards(card1, card2) {
    console.log('inside removeCards');

    const pos1 = openCards.indexOf(card1);
    console.log('the position1 is ' + pos1);
    openCards.splice(pos1, 1);

    const pos2 = openCards.indexOf(card2);
    console.log('the position2 is ' + pos2);
    openCards.splice(pos2, 1);

    console.log('the openCards length is ' + openCards.length);
    unlockCard(card1);
    unlockCard(card2);

}

/**
* End of no match functions
*/

function lockCard(card) {
    console.log('inside lockCard');
    card.removeEventListener('click', playGame);

}

function unlockCard(card) {
    console.log('inside unlockCard');
    card.addEventListener('click', playGame);

}

function updateMoves() {
    moveCounter++;
    const moves = document.querySelector('.moves');
    moves.textContent = moveCounter;
}

/**
* This is the function that makes everything start
*/

function setGame() {
    openCards = [];
    moveCounter = 0;
    timerInterval = null;
    timerValue = 0;
    timerGoing = false;

    // Get the timer span object and set it to display 0
    const timer = document.querySelector('.timer');
    timer.textContent = timerValue;

    const moves = document.querySelector('.moves');
    moves.textContent = moveCounter;

    const reset = document.querySelector('.restart');
    reset.addEventListener('click', restartGame);

    createDeck();

}

function restartGame() {
    stopTimer(timerInterval);
    setGame();
}

function startTimer() {
    timerGoing = true;
    // Get the timer span object
    const timer = document.querySelector('.timer');

    // Update timer every second
    let timerInt = window.setInterval(function() {
        updateTimer(timer)
    }, 1000);

    timerInterval = timerInt;

    return [timer, timerInt];
}

//This function receives an interval as parameter
function stopTimer(tmr) {
    window.clearInterval(tmr);
    timerGoing = false;
    console.log('the timer ends');
}

//This function receives a DOM object that updates with the new value of timerValue
function updateTimer(tmr) {
    timerValue++;
    tmr.textContent = timerValue;
}


/**
* The congratulations modal
*/

function popUpModal() {
    // Get the modal
    const modal = document.getElementById('myModal');

    // Update the game statistics in the modal
    document.getElementById('modalMoves').textContent = moveCounter;
    // modal.getElementById('modalStars').textContent = stars;
    document.getElementById('modalTimer').textContent = timerValue;

    // Open the modal
    modal.style.display = 'block';

    // Get the button that closes the modal
    const modalButton = document.getElementById('modalButton');
    console.log('the BUTTON is ' + modalButton);
    
    // Add event listener to play again button
    modalButton.addEventListener('click', function(){
      modal.style.display = 'none';
      setGame();
    }, false);
}

// TODO: The following onclick functionality should be erased after testing
// btn.onclick = function() {
//     modal.style.display = 'block';
// }
btn.onclick = popUpModal;

/**
* End of code for the modal
*/

setGame();


/**
* set up the event listener for a card. If a card is clicked:
*  - display the card's symbol (put this functionality in another function that you call from this one)
*  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
*  - if the list already has another card, check to see if the two cards match
*    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
*    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
*    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
*    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*/
