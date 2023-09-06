import Cell from './Cell.js';
import Piece from './Piece.js';
import PieceFactory from './PieceFactory.js';

export default class Game {
	static Mode = {EDIT: 'EDIT', PLAY: 'PLAY'};

	init(boardSize = 800, boardRows = 20, boardCols = 20) {
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
		this.initBoard();
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
	}

	changeMode(mode) {
		if (this.mode === mode) return;
		this.mode = mode;
		switch (mode) {
			case Game.Mode.EDIT:
				this.editButton.setAttribute('disabled', '');
				this.playButton.removeAttribute('disabled');
				this.gameDesc.textContent = "Editing."
				return;
			case Game.Mode.PLAY:
				this.playButton.setAttribute('disabled', '');
				this.editButton.removeAttribute('disabled');
				this.gameDesc.textContent = "Game start."
				return;
			default:
				return;
		}
	}

	initBoard() {
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
		this.container.addEventListener('click', (e) => this.handleClickBoard(e));
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
		    console.log(file);
		    const reader = new FileReader();
		    reader.onload = (evt) => {
			    console.log(evt.target.result);
			};
			reader.readAsBinaryString(file);
		}
	}
}
