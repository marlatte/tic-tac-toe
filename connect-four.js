/*
** The Game board represents the state of the board
** Each square holds a Cell (defined later)
** and we expose a dropToken method to be able to add Cells to squares
*/

function Gameboard() {
	const rows = 6;
	const columns = 7;
	const board = [];

	// Create a 2d array that will represent the state of the game board
	// For this 2d array, row 0 will represent the top row and
	// column 0 will represent the left-most column.
	// This nested-loop technique is a simple and common way to create a 2d array.
	for (let i = 0; i < rows; i++) {
		board[i] = [];
		for (let j = 0; j < columns; j++) {
			board[i].push(Cell());
		}
	}

	// This will be the method of getting the entire board that our
	// UI will eventually need to render it.
	const getBoard = () => board;

	// In order to drop a token, we need to find what the lowest point of the
	// selected column is, *then* change that cell's value to the player number
	const dropToken = (column, player) => {
		// Our board's outermost array represents the row,
		// so we need to loop through the rows, starting at row 0,
		// find all the rows that don't have a token, then take the
		// last one, which will represent the bottom-most empty cell
		const availableCells = board.filter((row) => row[column].getValue() === 0).map(row => row[column]);

		// If no cells make it through the filter, 
		// the move is invalid. Stop execution.
		if (!availableCells.length) return true;

		// Otherwise, I have a valid cell, the last one in the filtered array
		const lowestRow = availableCells.length - 1;
		board[lowestRow][column].addToken(player);
		return false;
	};

	// This method will be used to print our board to the console.
	// It is helpful to see what the board looks like after each turn as we play,
	// but we won't need it after we build our UI
	const printBoard = () => {
		const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
		return boardWithCellValues;
	};

	// Here, we provide an interface for the rest of our
	// application to interact with the board
	return { getBoard, dropToken, printBoard };
}

/*
** A Cell represents one "square" on the board and can have one of
** 0: no token is in the square,
** 1: Player One's token,
** 2: Player 2's token
*/

function Cell() {
	let value = 0;

	// Accept a player's token to change the value of the cell
	const addToken = (player) => {
		value = player;
	};

	// How we will retrieve the current value of this cell through closure
	const getValue = () => value;

	return {
		addToken,
		getValue
	};
}

/* 
** The GameController will be responsible for controlling the 
** flow and state of the game's turns, as well as whether
** anybody has won the game
*/
function GameController(
	playerOneName = "Player One",
	playerTwoName = "Player Two"
) {
	const board = Gameboard();

	const players = [
		{
			name: playerOneName,
			token: 1
		},
		{
			name: playerTwoName,
			token: 2
		}
	];

	let activePlayer = players[0];

	const switchPlayerTurn = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};
	const getActivePlayer = () => activePlayer;

	const printNewRound = () => {
		console.log(board.printBoard());
		console.log(`${getActivePlayer().name}'s turn.`);
	};

	const playRound = (column) => {
		// Drop a token for the current player
		console.log(
			`Dropping ${activePlayer.name}'s token into column ${column}...`
		);
		const fullBoard = board.dropToken(column, activePlayer.token);
		const grid = board.printBoard();

		const checkWin = () => {
			const rows = grid.length;
			const columns = grid[0].length;

			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < columns; x++) {
					// Find first token
					if (grid[y][x] === activePlayer.token) {
						// Check wins: horizontal, vertical, diagonal right, diagonal left
						if (x < columns - 3 &&
							grid[y][x] === grid[y][x + 1] &&
							grid[y][x] === grid[y][x + 2] &&
							grid[y][x] === grid[y][x + 3]) {
							return { type: "Horizontal", start: [y, x] };
						} else if (y < rows - 3 &&
							grid[y][x] === grid[y + 1][x] &&
							grid[y][x] === grid[y + 2][x] &&
							grid[y][x] === grid[y + 3][x]) {
							return { type: "Vertical", start: [y, x] };
						} else if (y < rows - 3 && x < columns - 3 &&
							grid[y][x] === grid[y + 1][x + 1] &&
							grid[y][x] === grid[y + 2][x + 2] &&
							grid[y][x] === grid[y + 3][x + 3]) {
							return { type: "Diagonal Right", start: [y, x] };
						} else if (y < rows - 3 && x > 2 &&
							grid[y][x] === grid[y + 1][x - 1] &&
							grid[y][x] === grid[y + 2][x - 2] &&
							grid[y][x] === grid[y + 3][x - 3]) {
							return { type: "Diagonal Left", start: [y, x] };
						} else {
							return
						}
					}
				}
			}
		};

		const endGame = (fullBoard, winDetails) => {
			if (fullBoard) {
				console.log("Game Over: Tie.")
			} else {
				console.log(`Game Over: ${winDetails.type} win for ${activePlayer.name} from Row ${winDetails.start[0]}, Column ${winDetails.start[1]}!`);
			}
		}

		const winDetails = checkWin();
		if (fullBoard || !!winDetails) {
			console.log(grid)
			endGame(fullBoard, winDetails)
		} else {
			// Switch player turn
			switchPlayerTurn();
			printNewRound();
		}

	};

	// Initial play game message
	printNewRound();

	// For the console version, we will only use playRound, but we will need
	// getActivePlayer for the UI version, so I'm revealing it now
	return {
		playRound,
		getActivePlayer,
	};
}

const game = GameController();

{// -------------------------------------------------------------------------------- //
	// ----------------------------     Pseudo     ------------------------------------ //
	// -------------------------------------------------------------------------------- //

	/*
	
	User story:
	As a < type of user >, I want < some goal > so that < some reason >
	
	Logical flow:
	A few sentences on general functionality and the steps necessary to do all those things.
	
	*/



	// -------------------------------------------------------------------------------- //
	// ---------------------------     Variables    ----------------------------------- //
	// -------------------------------------------------------------------------------- //


	// -- Behind the Scenes -- //


	// -- On-Screen Stuff -- //


	// -------------------------------------------------------------------------------- //
	// ----------------------     Functions & Methods    ------------------------------ //
	// -------------------------------------------------------------------------------- //


	// -- Behind the Scenes -- //


	// -- On-Screen Stuff -- //


	// -------------------------------------------------------------------------------- //
	// --------------------     Calls & Event Listeners    ---------------------------- //
	// -------------------------------------------------------------------------------- //


	// -- Behind the Scenes -- //


	// -- On-Screen Stuff -- //


}