let humanScore = 0;
let computerScore = 0;
let currentRoundNumber = 1;

// Write your code below:

function generateTarget() {
    return Math.floor(Math.random() * 10);
}

const compareGuesses = ( humanGuess, computerGuess, secretTargetNumber ) => {
    let humanDiff = Math.abs(humanGuess - secretTargetNumber);
    let computerDiff = Math.abs(computerGuess - secretTargetNumber);
    if(humanDiff <= computerDiff) {
        return true;
    }
    else {
        return false;
    }
}

const updateScore = (winner) => {
    if(winner === 'human') humanScore++;
    else computerScore++;
}

const advanceRound = () => {
    currentRoundNumber++;
}