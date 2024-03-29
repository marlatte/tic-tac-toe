const gameBoard = (() => {
	// Generate a 3x3 grid.
	const grid = [];
	for (let i = 0; i < 3; i++) {
		grid[i] = [];
		for (let j = 0; j < 3; j++) {
			grid[i].push(Square());
		}
	}

	function Square() {
		let value = 0;
		const getValue = () => value;
		const setValue = (player) => {
			value = player;
			return true;
		};
		return { getValue, setValue };
	}

	const getGrid = () => grid;

	// Mark a square for the current player if it's open.
	function markSquare(row, column, playerMarker) {
		const square = grid[row][column];
		return square.getValue() === 0 ? square.setValue(playerMarker) : false;
	}

	// Console version: Printing the grid
	function getGridValues() {
		return grid.map((row) => row.map((square) => square.getValue()));
	}

	function resetGame() {
		grid.forEach((row) => {
			row.forEach((square) => {
				square.setValue(0);
			});
		});
	}

	return { markSquare, getGrid, getGridValues, resetGame };
})();

const gameController = (() => {
	const PlayerFactory = (number) => {
		const name = `Player ${number}`;
		const marker = number;
		const getName = () => name;
		const getMarker = () => marker;
		return { getName, getMarker };
	};

	const player1 = PlayerFactory(1);
	const player2 = PlayerFactory(2);

	let currentPlayer = player1;
	const getCurrentPlayer = () => currentPlayer;

	function switchPlayer() {
		currentPlayer = currentPlayer === player1 ? player2 : player1;
	}

	function printNextRound() {
		console.log(gameBoard.getGridValues());
		console.log(`${currentPlayer.getName()}'s turn...`);
	}

	function playRound(inputRow, inputColumn) {
		console.log(
			`Marking square Row ${inputRow}, Column ${inputColumn} for ${currentPlayer.getName()}...`
		);

		// Mark a square on the board, checking if the position is open.
		const positionOpen = gameBoard.markSquare(
			inputRow,
			inputColumn,
			currentPlayer.getMarker()
		);
		if (!positionOpen) {
			console.log(
				`!!! Position already taken, try again ${currentPlayer.getName()} !!!`
			);
			printNextRound();
			const getGameDetails = () => undefined;
			return { getGameDetails };
		}

		const grid = gameBoard.getGridValues();

		// Check for a winner
		function checkGameOver() {
			// 	Winner = 3 in a row/column/diagonal
			for (let y = 0; y < 3; y++) {
				for (let x = 0; x < 3; x++) {
					// Find first token
					if (grid[y][x] === currentPlayer.getMarker()) {
						// Check wins: horizontal, vertical, diagonal right, diagonal left
						if (
							y === 0 &&
							x === 0 &&
							grid[y][x] === grid[y + 1][x + 1] &&
							grid[y][x] === grid[y + 2][x + 2]
						) {
							return {
								type: "Win",
								winPattern: "diagonally, top L to bottom R",
								squares: {
									start: { y, x },
									middle: { y: y + 1, x: x + 1 },
									end: { y: y + 2, x: x + 2 },
								},
							};
						} else if (
							y === 0 &&
							x === 2 &&
							grid[y][x] === grid[y + 1][x - 1] &&
							grid[y][x] === grid[y + 2][x - 2]
						) {
							return {
								type: "Win",
								winPattern: "diagonally, top R to bottom L",
								squares: {
									start: { y, x },
									middle: { y: y + 1, x: x - 1 },
									end: { y: y + 2, x: x - 2 },
								},
							};
						} else if (
							y === 0 &&
							grid[y][x] === grid[y + 1][x] &&
							grid[y][x] === grid[y + 2][x]
						) {
							return {
								type: "Win",
								winPattern: "vertically",
								squares: {
									start: { y, x },
									middle: { y: y + 1, x },
									end: { y: y + 2, x },
								},
							};
						} else if (
							x === 0 &&
							grid[y][x] === grid[y][x + 1] &&
							grid[y][x] === grid[y][x + 2]
						) {
							return {
								type: "Win",
								winPattern: "horizontally",
								squares: {
									start: { y, x },
									middle: { y, x: x + 1 },
									end: { y, x: x + 2 },
								},
							};
						}
					}
				}
			}

			// 	Tie = full board
			if (!grid.some((row) => row.some((square) => square === 0))) {
				console.log("Tie");
				return { type: "tie" };
			} else return;
		}

		function endGame(gameDetails) {
			console.log(gameBoard.getGridValues());
			console.log(
				`Game Over: ${
					gameDetails.type === "tie"
						? "Tie"
						: `${currentPlayer.getName()} wins ${
								gameDetails.winPattern
						  }`
				}.`
			);
		}

		// Check whether to play next round
		const gameDetails = checkGameOver();

		if (!!gameDetails) {
			endGame(gameDetails);
		} else {
			switchPlayer();
			printNextRound();
		}

		const getGameDetails = () => gameDetails;

		return { getGameDetails };
	}

	// Computer Logic
	function getComputerChoice() {
		let openPositions = [];
		for (let y = 0; y < 3; y++) {
			for (let x = 0; x < 3; x++) {
				if (gameBoard.getGridValues()[y][x] === 0)
					openPositions.push([y, x]);
			}
		}
		console.log(openPositions);
		return openPositions[Math.floor(Math.random() * openPositions.length)];
	}

	function resetGame() {
		currentPlayer = player1;
		gameBoard.resetGame();
		console.log("---------- \n New Game \n----------");
		printNextRound();
	}

	return {
		playRound,
		getGrid: gameBoard.getGrid,
		getCurrentPlayer,
		resetGame,
		getComputerChoice,
	};
})();

const screenController = (() => {
	let playMode;

	const homeScreen = document.querySelector("header");
	const resetScreen = document.querySelectorAll(".reset-screen");
	const startBtns = document.querySelectorAll(".start");

	const gameScreen = document.querySelector("main");
	const boardDisplay = document.querySelector(".game-board");
	const currentPlayerDisplay = document.querySelector(".current-player");
	const gameText = document.querySelectorAll(".game-text");
	const resetBtn = document.getElementById("reset-btn");
	const homeBtn = document.getElementById("home-btn");

	function updateDisplay() {
		// Update player turn based on marker
		const currentPlayer = gameController.getCurrentPlayer().getMarker();
		currentPlayerDisplay.classList = `current-player ${
			currentPlayer === 1 ? "x-char" : "o-char"
		}`;

		// Clear and get the latest game board.
		boardDisplay.textContent = "";
		const grid = gameController.getGrid();

		// Loop through the board and create buttons for each square
		grid.forEach((row, y) => {
			row.forEach((square, x) => {
				const sqrContainer = document.createElement("div");
				sqrContainer.classList.add("sqr-container");

				const squareBtn = document.createElement("button");
				squareBtn.classList.add("square");

				squareBtn.dataset.column = x;
				squareBtn.dataset.row = y;

				let marker = square.getValue();
				squareBtn.classList = `square ${
					marker === 0 ? "" : marker === 1 ? "x-char" : "o-char"
				}`;
				boardDisplay.appendChild(sqrContainer);
				sqrContainer.appendChild(squareBtn);
			});
		});
	}

	function endGameDisplay(gameDetails) {
		if (gameDetails.type === "tie") {
			currentPlayerDisplay.classList = "current-player outcome";
			currentPlayerDisplay.textContent = "It's a tie!";
		} else {
			currentPlayerDisplay.textContent = "wins!";
			currentPlayerDisplay.classList.add("outcome");
			const squares = gameDetails.squares;
			for (const pair in squares) {
				Array.from(boardDisplay.children)
					.find((container) => {
						return (
							+container.firstElementChild.dataset.row ===
								squares[pair].y &&
							+container.firstElementChild.dataset.column ===
								squares[pair].x
						);
					})
					.classList.add("winner");
			}
		}

		gameText.forEach((el) => {
			el.classList.toggle("hidden");
		});

		boardDisplay.removeEventListener("click", handleGameClick);
	}

	function handleGameClick(e) {
		const inputRow = e.target.dataset.row;
		const inputColumn = e.target.dataset.column;
		if (!inputRow) return;
		playRound(inputRow, inputColumn);

		// Check for computer turn
		if (
			playMode === "single" &&
			gameController.getCurrentPlayer().getMarker() === 2
		) {
			boardDisplay.removeEventListener("click", handleGameClick);
			const computerChoice = gameController.getComputerChoice();
			setTimeout(() => {
				playRound(computerChoice[0], computerChoice[1]);
			}, 300);
		}
	}

	function playRound(row, column) {
		const gameDetails = gameController
			.playRound(row, column)
			.getGameDetails();
		updateDisplay();
		if (!!gameDetails) {
			endGameDisplay(gameDetails);
		} else boardDisplay.addEventListener("click", handleGameClick);
	}

	function resetGame(mode) {
		playMode = mode;
		setGameText();
		gameController.resetGame();
		boardDisplay.addEventListener("click", handleGameClick);
		updateDisplay();
	}

	function setGameText() {
		if (gameText[0].classList.value.includes("hidden")) {
			gameText[0].classList.remove("hidden");
		}
		if (!gameText[1].classList.value.includes("hidden")) {
			gameText[1].classList.add("hidden");
		}
		currentPlayerDisplay.textContent = "'s turn.";
	}

	function goToHomeScreen() {
		homeScreen.classList = "";
		startBtns.forEach((button) => {
			button.addEventListener("click", startGame);
		});
		boardDisplay.removeEventListener("click", handleGameClick);
		resetBtn.removeEventListener("click", resetGame);
		homeBtn.removeEventListener("click", goToHomeScreen);
	}

	function startGame(e) {
		resetGame(e.target.id);
		homeScreen.classList = "up-north";
		resetBtn.addEventListener("click", () => {
			resetScreen.forEach((el) => {
				el.classList.remove("shrunk");
			});
			setTimeout(() => {
				resetGame(playMode);
				resetScreen.forEach((el) => {
					el.classList.add("shrunk");
				});
			}, 900);
		});
		homeBtn.addEventListener("click", goToHomeScreen);
		startBtns.forEach((button) => {
			button.removeEventListener("click", startGame);
		});
	}

	goToHomeScreen();
})();
