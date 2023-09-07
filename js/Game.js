import Cell from './Cell.js';
import Piece from './Piece.js';
import PieceFactory from './PieceFactory.js';

export default class Game {
	static Mode = {EDIT: 'EDIT', PLAY: 'PLAY'};

	constructor(boardSize = 800, boardRows = 20, boardCols = 20) {
		this.container = document.getElementById('main-container');
		this.controlPanel = document.getElementById('control-panel');
		this.editButton = document.getElementById('edit');
		this.playButton = document.getElementById('play');
		this.gameDesc =  document.getElementById('game-desc');
		this.download =  document.getElementById('download');
		this.exportButton = document.getElementById('export');
		this.importButton = document.getElementById('import');
		this.fileElem = document.getElementById('fileElem');
		this.boardSize = boardSize;
		this.boardRows = boardRows;
		this.boardCols = boardCols;
		this.cells = new Map();
		this.mode = Game.Mode.EDIT;
		this.keyDown = false;
		this.initEmptyBoard();
		this.editButton.addEventListener('click', () => this.changeMode(Game.Mode.EDIT));
		this.playButton.addEventListener('click', () => this.changeMode(Game.Mode.PLAY));
		this.exportButton.addEventListener('click', () => this.exportBoard());

		this.importButton.addEventListener(
		  "click",
		  (e) => {
		    if (this.fileElem) {
		      this.fileElem.click();
		    }
		    e.preventDefault(); // prevent navigation to "#"
		  },
		  false,
		);

		this.fileElem.addEventListener("change", () => this.handleFiles(), false);
		this.container.addEventListener('click', (e) => this.handleClickBoard(e));
		window.addEventListener('keydown', (e) => this.handleKeyDown(e));
		window.addEventListener('keyup', (e) => this.handleKeyUp(e));
	}

	changeMode(mode) {
		if (this.mode === mode) return;
		this.mode = mode;
		switch (mode) {
			case Game.Mode.EDIT:
				this.editButton.setAttribute('disabled', '');
				this.playButton.removeAttribute('disabled');
				this.importButton.removeAttribute('disabled');
				this.exportButton.removeAttribute('disabled');
				this.gameDesc.textContent = "Editing."
				return;
			case Game.Mode.PLAY:
				this.playButton.setAttribute('disabled', '');
				this.editButton.removeAttribute('disabled');
				this.importButton.setAttribute('disabled', '');
				this.exportButton.setAttribute('disabled', '');
				this.gameDesc.textContent = "Game start."
				return;
			default:
				return;
		}
	}

	initFromJson(boardStr) {
		let boardObj;
		try {
			boardObj = JSON.parse(boardStr);
		} catch (e) {
			alert("import failed");
		}

		this.init(boardObj.size, boardObj.rows, boardObj.cols, boardObj.cells);
	}

	init(size, rows, cols, cells) {
		this.boardSize = size;
		this.boardRows = rows;
		this.boardCols = cols;
		this.cells = new Map();
		this.mode = Game.Mode.EDIT;
		this.container.innerHTML = '';
		for (let i = 0; i < this.boardRows; i++) {
			for (let j = 0; j < this.boardCols; j++) {
				const hash = `${i}-${j}`;
				const cellElem = document.createElement('div');
				cellElem.setAttribute('id', hash);
				cellElem.setAttribute('class', `cell`);
				const cell = new Cell(i, j, cellElem);
				const cellObj = cells[i * rows + j];
				const piece = PieceFactory.createPiece(cellObj.pieceType);
				if (piece) {
					if (piece.getType() === Piece.Type.DROPLET) {
						if (cellObj.isMain) {
							piece.setIsMain(true);
						}
						if (cellObj.form) {
							piece.setForm(cellObj.form);
						}
						if (cellObj.status) {
							piece.setStatus(cellObj.status);
						}
					}
					cell.updatePiece(piece);
				}
				this.cells.set(hash, cell);
				this.container.append(cellElem);
			}
		}
	}

	initEmptyBoard() {
		for (let i = 0; i < this.boardRows; i++) {
			for (let j = 0; j < this.boardCols; j++) {
				const hash = `${i}-${j}`;
				const cell = document.createElement('div');
				cell.setAttribute('id', hash);
				cell.setAttribute('class', `cell`);
				this.cells.set(hash, new Cell(i, j, cell));
				this.container.append(cell);
			}
		}
	}

	handleClickBoard(event) {
		if (!event.target.classList.contains('cell')) return;
		const hash = event.target.id;
		const cell = this.cells.get(hash);
		switch (this.mode) {
			case Game.Mode.EDIT:
				this.editPiece(cell);
				return;
			default:
				return;
		} 
	}

	editPiece(cell) {
		const piece = cell.getPiece();
		const currentType = piece?.getType() ?? null;
		if (currentType === Piece.Type.DROPLET && !piece.getIsMain()) {
			piece.setIsMain(true);
			cell.updateSprit();
			return;
		}
		const index = Object.values(Piece.Type).indexOf(currentType);

		const nextType = Piece.Type[Object.keys(Piece.Type)[index + 1]] ?? null;

		cell.updatePiece(PieceFactory.createPiece(nextType));
	}

	exportBoard() {
		const boardObj = {rows: this.boardRows, cols: this.boardCols, size: this.boardSize, cells: []};

		for (let i = 0; i < this.boardRows; i++) {
			for (let j = 0; j < this.boardCols; j++) {
				const hash = `${i}-${j}`;
				const cell = this.cells.get(hash);
				const piece = cell.getPiece();
				const cellObj = {
					pieceType: piece?.getType() ?? null,
				};

				if (piece?.getType() === Piece.Type.DROPLET) {
					cellObj.isMain = piece.getIsMain();
					cellObj.form = piece.getForm();
					cellObj.status = piece.getStatus();
				}

				boardObj.cells.push(cellObj);
			}
		}

		const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(boardObj));
		this.download.setAttribute("href", dataStr);
		this.download.setAttribute("download", "board.json");
		this.download.click();
	}

	handleFiles() {
		for (const file of this.fileElem.files) {
		    const reader = new FileReader();
		    reader.onload = (evt) => this.initFromJson(evt.target.result);
			reader.readAsBinaryString(file);
		}
	}

	handleKeyDown(event) {
		if (this.mode !== Game.Mode.PLAY) return;
		if (this.keyDown) return;
		this.keyDown = true;

		let vector = [0, 0];
		switch (event.key) {
			case 'ArrowUp':
				vector = [-1, 0];
				break;
			case 'ArrowDown':
				vector = [1, 0];
				break;
			case 'ArrowLeft':
				vector = [0, -1];
				break;
			case 'ArrowRight':
				vector = [0, 1];
				break;
			default:
				break;
		}

		const cellsToMove = new Set();
		const mainDropletCells = this.findMainDropletCells();
		for (const cell of mainDropletCells) {
			this.findMovingDropletCells(cell, cellsToMove);
		}
		for (const cellToMove of cellsToMove) {
			this.tryMove(cellToMove, vector);
		}
	}

	tryMove(cell, vector) {

	}

	handleKeyUp() {
		this.keyDown = false;
	}

	findMovingDropletCells(startCell, res = new Set()) {
		if (startCell?.getPiece()?.getType() !== Piece.Type.DROPLET) return;
		if (res.has(startCell)) return;

		res.add(startCell);

		const fourDirections = [[-1,0],[1,0],[0,-1],[0,1]];

		for (const [row, col] of fourDirections) {
			const hash = `${row + startCell.getPosition()[0]}-${col + startCell.getPosition()[1]}`;
			const checkingCell = this.cells.get(hash);

			this.findMovingDropletCells(checkingCell, res);
		}
	}

	findMainDropletCells() {
		const res = [];
		for (var [key, cell] of this.cells) {
			if (cell.getPiece()?.getType() === Piece.Type.DROPLET && cell.getPiece().getIsMain()) {
				res.push(cell);
			}
		}
		return res;
	}
}
