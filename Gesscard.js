let card1Value, card2Value;

function generateCards() { 
    card1Value = Math.floor(Math.random() * 10) + 1;
    card2Value = Math.floor(Math.random() * 10) + 1;

    document.getElementById('card1').textContent = '?';
    document.getElementById('card2').textContent = '?';
    document.getElementById('card1').classList.remove('revealed');
    document.getElementById('card2').classList.remove('revealed');
    document.getElementById('message').textContent = 'Make a guess!';
}

function revealCards() { 
    document.getElementById('card1').textContent = card1Value;
    document.getElementById('card2').textContent = card2Value;
    document.getElementById('card1').classList.add('revealed');
    document.getElementById('card2').classList.add('revealed');
}

function guess(playerGuess) {
    revealCards();
 
    let resultMessage = '';
    if (playerGuess === 'higher') {
        if (card1Value > card2Value) {
            resultMessage = 'You guessed correctly! Card 1 is higher.';
        } else {
            resultMessage = 'Wrong guess. Card 2 is higher.';
        }
    } else if (playerGuess === 'lower') {
        if (card1Value < card2Value) {
            resultMessage = 'You guessed correctly! Card 1 is lower.';
        } else {
            resultMessage = 'Wrong guess. Card 2 is lower.';
        }
    }

    document.getElementById('message').textContent = resultMessage;

    setTimeout(generateCards, 2000);
}

window.onload = generateCards;
