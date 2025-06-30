const gameBoard = (function () {
  const rows = 3;
  const columns = 3;
  const board = [];

  // Initialize board
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const dropToken = (row, column, player) => {
    if (board[row][column].getValue() !== 0) {
      return false;
    }
    board[row][column].addToken(player);
    return true;
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        board[i][j] = Cell();
      }
    }
  };

  return { getBoard, dropToken, printBoard, resetBoard };
})();

// Cell Factory Function
function Cell() {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addToken, getValue };
}

// Game Controller
function GameController(
  playerOneName = "Player 1",
  playerTwoName = "Player 2"
) {
  const board = gameBoard;

  const players = [
    { name: playerOneName, token: 1, symbol: "X" },
    { name: playerTwoName, token: 2, symbol: "O" },
  ];

  let activePlayer = players[0];
  let gameOver = false;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const checkWinner = () => {
    const boardState = board.getBoard();

    // Check rows
    for (let i = 0; i < 3; i++) {
      if (
        boardState[i][0].getValue() !== 0 &&
        boardState[i][0].getValue() === boardState[i][1].getValue() &&
        boardState[i][1].getValue() === boardState[i][2].getValue()
      ) {
        return boardState[i][0].getValue();
      }
    }

    // Check columns
    for (let j = 0; j < 3; j++) {
      if (
        boardState[0][j].getValue() !== 0 &&
        boardState[0][j].getValue() === boardState[1][j].getValue() &&
        boardState[1][j].getValue() === boardState[2][j].getValue()
      ) {
        return boardState[0][j].getValue();
      }
    }

    // Check diagonals
    if (
      boardState[0][0].getValue() !== 0 &&
      boardState[0][0].getValue() === boardState[1][1].getValue() &&
      boardState[1][1].getValue() === boardState[2][2].getValue()
    ) {
      return boardState[0][0].getValue();
    }

    if (
      boardState[0][2].getValue() !== 0 &&
      boardState[0][2].getValue() === boardState[1][1].getValue() &&
      boardState[1][1].getValue() === boardState[2][0].getValue()
    ) {
      return boardState[0][2].getValue();
    }

    return null;
  };

  const checkTie = () => {
    const boardState = board.getBoard();
    return boardState.every((row) =>
      row.every((cell) => cell.getValue() !== 0)
    );
  };

  const playRound = (row, column) => {
    if (gameOver) return false;

    const success = board.dropToken(row, column, getActivePlayer().token);
    if (!success) return false;

    const winner = checkWinner();
    if (winner) {
      gameOver = true;
      const winnerPlayer = players.find((p) => p.token === winner);
      document.querySelector(
        ".winner"
      ).textContent = `${winnerPlayer.name} Wins!`;
      document.querySelector(".turn").textContent = "Game Over";
      return true;
    }

    if (checkTie()) {
      gameOver = true;
      document.querySelector(".winner").textContent = "It's a Tie!";
      document.querySelector(".turn").textContent = "Game Over";
      return true;
    }

    switchPlayerTurn();
    updateTurnDisplay();
    return true;
  };

  const updateTurnDisplay = () => {
    if (!gameOver) {
      document.querySelector(".turn").textContent = `${
        getActivePlayer().name
      }'s Turn`;
    }
  };

  const resetGame = () => {
    board.resetBoard();
    activePlayer = players[0];
    gameOver = false;
    document.querySelector(".winner").textContent = "";
    updateTurnDisplay();
    renderBoard();
  };

  return { playRound, getActivePlayer, resetGame, players };
}

// Initialize game
const game = GameController();

// DOM Manipulation
function renderBoard() {
  const boardElement = document.querySelector(".board");
  boardElement.innerHTML = "";

  const boardState = gameBoard.getBoard();

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.column = j;

      const cellValue = boardState[i][j].getValue();
      if (cellValue !== 0) {
        const player = game.players.find((p) => p.token === cellValue);
        cell.textContent = player.symbol;
        cell.classList.add("disabled");
      }

      cell.addEventListener("click", handleCellClick);
      boardElement.appendChild(cell);
    }
  }
}

function handleCellClick(e) {
  const row = parseInt(e.target.dataset.row);
  const column = parseInt(e.target.dataset.column);

  const success = game.playRound(row, column);
  if (success) {
    renderBoard();
  }
}

function resetGame() {
  game.resetGame();
}

// Initialize the game display
renderBoard();
