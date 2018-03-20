/*
 * Create a list that holds all of your cards
 */
var iconClasses = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
var openCards = [];
let counter = 0;
const timer = document.querySelector('.timer');
let timerValue = 0;
// Update timer every second
let timerInterval = window.setInterval(updateTimer, 1000);

function createListOfCards(array) {
    var cards = [];

    array.forEach(function(item, index, array) {
      let i = 1;
      while (i <= 2){
        const newCard = document.createElement('li');
        newCard.classList.add("card");
        const newIcon = document.createElement('i');
        newIcon.classList.add("fa", item, "rotate-y-minus-180");
        newCard.appendChild(newIcon);
        //Here is where I add the event listener to each card
        newCard.addEventListener("click", playGame);
        cards.push(newCard);
        i++;
      }
    });
    return cards;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

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

    listOfCards.forEach(function(item, index, array) {
        fragment.appendChild(item);
    });

    deck.appendChild(fragment);
}

function playGame (e) {
    lockCard(e.target);
    e.target.classList.add('open', 'show');
    openCards.push(e.target);
    console.log("list of open cards " + openCards);   //TODO erase this line after testing is complete

    if (openCards.length % 2 === 0) {
        if (openCards[openCards.length-2].firstChild.classList.contains(openCards[openCards.length-1].firstChild.classList.item(1))) {
            console.log("the player has a match");    // TODO erase this line after testing is complete
            lockCard(openCards[openCards.length-1]);
            lockCard(openCards[openCards.length-2]);
            updateMoves();
            console.log("moves equals " + counter);
            if (openCards.length === 16) {
                stopGame();
            }
        } else {
            //TODO erase next line after testing is complete
            console.log("no match, call closeCard " + openCards[openCards.length-2].firstChild.classList + openCards[openCards.length-1].firstChild.classList);

            var delayInMilliseconds = 500; //half second
            setTimeout(function() {
                //code to be executed after half second
                noMatch(openCards[openCards.length-1]);
                noMatch(openCards[openCards.length-2]);
            }, delayInMilliseconds);
            updateMoves();
            console.log("moves equals " + counter);

        }

    }

}

function noMatch (card) {
    card.classList.add('no-match');
    var delayInMilliseconds = 500; //half second
    setTimeout(function() {
        //code to be executed after half second
        closeCard(card);
    }, delayInMilliseconds);

}

function closeCard (card) {
    console.log('inside closeCard');
    card.classList.remove('open', 'show', 'no-match');
    removeCard(card);
}

function removeCard (card) {
    console.log('inside removeCard');

    var pos = openCards.indexOf(card);
    console.log("the position is " + pos);
    openCards.splice(pos, 1);
    console.log("the openCards length is " + openCards.length);
    unlockCard(card);

}

function lockCard (card) {
    console.log('inside lockCard');
    card.removeEventListener("click", playGame);

}

function unlockCard (card) {
    console.log('inside unlockCard');
    card.addEventListener("click", playGame);

}

function updateMoves () {
    counter++;
    const moves = document.querySelector(".moves");
    moves.textContent = counter;
}

function setGame () {
    openCards = [];
    counter = 0;
    timerValue = 0;

    const moves = document.querySelector(".moves");
    moves.textContent = counter;

    const reset = document.querySelector(".restart");
    reset.addEventListener('click', setGame);

    createDeck();

}

function stopGame () {
    window.clearInterval(timerInterval);
    console.log('the timer ends with value ' + timerValue);
}

function updateTimer () {
    timerValue++;
    timer.textContent = timerValue;
}

setGame();


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
