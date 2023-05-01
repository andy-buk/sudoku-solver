const sudokuGrid = document.getElementById("sudoku-grid");
const solveBtn = document.getElementById("solve-btn");
const clearBtn = document.getElementById("clear-btn");

// Generate input grid
for (let i = 0; i < 81; i++) {
  const input = document.createElement("input");
  input.type = "number";
  input.min = 1;
  input.max = 9;
  input.addEventListener("input", (event) => {
    const value = event.target.value;
    if (value < 1 || value > 9) {
      event.target.value = "";
    }
    event.target.classList.add("user-input");
  });
  sudokuGrid.appendChild(input);
}

function getGridValues() {
  const values = [];
  for (let i = 0; i < 81; i++) {
    const value = parseInt(sudokuGrid.children[i].value) || -1;
    if (i % 9 === 0) {
      values.push([]);
    }
    values[values.length - 1].push(value);
  }
  return values;
}

function setGridValues(values) {
  for (let i = 0; i < 81; i++) {
    const value = values[Math.floor(i / 9)][i % 9];
    sudokuGrid.children[i].value = value !== -1 ? value : "";
  }
}

// Checks if puzzle is valid
function isValidPuzzle(puzzle) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = puzzle[row][col];
      if (value !== -1) {
        puzzle[row][col] = -1;
        if (!isValid(puzzle, value, row, col)) {
          return false;
        }
        puzzle[row][col] = value;
      }
    }
  }
  return true;
}

// Alertbox
const alertBox = document.getElementById("alert-box");
const alertMessage = document.getElementById("alert-message");
const closeBtn = document.querySelector(".close-btn");

function showAlert(message) {
  alertMessage.innerText = message;
  alertBox.style.display = "block";
}

function hideAlert() {
  alertBox.style.display = "none";
}

closeBtn.addEventListener("click", hideAlert);

solveBtn.addEventListener("click", () => {
  const grid = getGridValues();
  if (isValidPuzzle(grid)) {
    const solved = solveSudoku(grid);
    if (solved) {
      setGridValues(grid);
    } else {
      showAlert("This Sudoku puzzle cannot be solved.");
    }
  } else {
    showAlert("The initial Sudoku puzzle is invalid. Please correct the input.");
  }
});

// Clear button
clearBtn.addEventListener("click", () => {
  setGridValues(new Array(9).fill().map(() => new Array(9).fill(-1)));
  for (let i = 0; i < 81; i++) {
    sudokuGrid.children[i].classList.remove('user-input');
  }
});

// Solver functions
function nextEmpty(puzzle) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (puzzle[r][c] === -1) {
        return [r, c];
      }
    }
  }
  return [null, null];
}

function isValid(puzzle, guess, row, col) {
  const rowVal = puzzle[row];
  if (rowVal.includes(guess)) {
    return false;
  }

  const colVal = [];
  for (let i = 0; i < 9; i++) {
    colVal.push(puzzle[i][col]);
  }
  if (colVal.includes(guess)) {
    return false;
  }

  const rowStart = Math.floor(row / 3) * 3;
  const colStart = Math.floor(col / 3) * 3;
  for (let r = rowStart; r < rowStart + 3; r++) {
    for (let c = colStart; c < colStart + 3; c++) {
      if (puzzle[r][c] === guess) {
        return false;
      }
    }
  }
  return true;
}

function solveSudoku(puzzle) {
  const [row, col] = nextEmpty(puzzle);
  if (row === null) {
    return true;
  }

  for (let guess = 1; guess <= 9; guess++) {
    if (isValid(puzzle, guess, row, col)) {
      puzzle[row][col] = guess;
      if (solveSudoku(puzzle)) {
        return true;
      }
    }
    puzzle[row][col] = -1;
  }
  return false;
}
