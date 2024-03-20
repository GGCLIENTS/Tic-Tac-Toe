const cells = document.querySelectorAll('.cell');
const resultDisplay = document.getElementById('result');
const playerModeButton = document.createElement('button');
playerModeButton.textContent = 'Player vs Bot Mode';
document.body.insertBefore(playerModeButton, document.getElementById('container'));

let currentPlayer = 'X';
let gameActive = true;
let moves = 0;
let playerVsBotMode = false;
let botDifficulty = 'normal';

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function resetGame() {
    currentPlayer = 'X';
    gameActive = true;
    moves = 0;
    resultDisplay.textContent = '';
    cells.forEach(cell => {
        cell.textContent = '';
    });
}

function checkWinner() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (cells[a].textContent === currentPlayer && cells[b].textContent === currentPlayer && cells[c].textContent === currentPlayer) {
            gameActive = false;
            resultDisplay.textContent = `${currentPlayer} wins!`;
            return;
        }
    }
    if (moves === 9) {
        gameActive = false;
        resultDisplay.textContent = "It's a draw!";
    }
}

function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = parseInt(cell.id.split('-')[1]);

    if (cell.textContent === '' && gameActive) {
        cell.textContent = currentPlayer;
        moves++;
        checkWinner();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (playerVsBotMode && currentPlayer === 'O' && gameActive) {
            makeBotMove();
        }
    }
}

function makeBotMove() {
    let botMoveIndex;

    if (botDifficulty === 'easy') {
        botMoveIndex = makeRandomMove();
    } else if (botDifficulty === 'normal') {
        botMoveIndex = makeSmartMove();
    } else if (botDifficulty === 'hard') {
        botMoveIndex = makeAdvancedSmartMove();
    } else if (botDifficulty === 'gamer') {
        botMoveIndex = makeGamerMove();
    }

    cells[botMoveIndex].textContent = currentPlayer;
    moves++;
    checkWinner();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function makeRandomMove() {
    let availableCells = [];
    cells.forEach((cell, index) => {
        if (cell.textContent === '') {
            availableCells.push(index);
        }
    });
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    return availableCells[randomIndex];
}

function makeSmartMove() {
    return checkForTwoInARow(currentPlayer) || makeRandomMove();
}

function makeAdvancedSmartMove() {
    return checkForTwoInARow('O') || checkForTwoInARow('X') || makeRandomMove();
}

function makeGamerMove() {
    return checkForTwoInARow('O') || checkForTwoInARow('X') || makeSmartMove() || makeRandomMove();
}

function checkForTwoInARow(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        const line = [cells[a].textContent, cells[b].textContent, cells[c].textContent];
        const count = line.filter(cell => cell === player).length;
        if (count === 2 && line.includes('')) {
            if (line[0] === '') return a;
            if (line[1] === '') return b;
            if (line[2] === '') return c;
        }
    }
    return null;
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));

playerModeButton.addEventListener('click', () => {
    playerVsBotMode = true;
    playerModeButton.disabled = true;
    botDifficulty = prompt('Choose bot difficulty (easy, normal, hard, gamer):');
    resetGame(); 
});
