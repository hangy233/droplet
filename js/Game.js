import Cell from './Cell.js';
import Piece from './Piece.js';
import PieceFactory from './PieceFactory.js';

export default class Game {
	static Mode = {EDIT: 'EDIT', PLAY: 'PLAY'};

	init(boardSize = 800, boardRows = 20, boardCols = 20) {
		this.container = document.getElementById('main-container');
		this.boardSize = boardSize;
		this.boardRows = boardRows;
		this.boardCols = boardCols;
		this.cells = new Map();
		this.mode = Game.Mode.EDIT;
		this.initBoard();
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
		this.container.addEventListener('click', (e) => this.handleClick(e));
	}

	handleClick(event) {
		if (!event.target.classList.contains('cell')) return;
		const hash = event.target.id;
		const cell = this.cells.get(hash);
		switch (this.mode) {
			case Game.Mode.EDIT:
				this.updatePiece(cell);
				return;
			default:
				return;
		} 
	}

	updatePiece(cell) {
		const piece = cell.getPiece();
		const currentType = piece?.getType() ?? null;
		if (currentType === Piece.Type.DROPLET && !piece.getIsMain()) {
			piece.setIsMain(true);
			cell.updateSprit();
		}
		const index = Object.values(Piece.Type).indexOf(currentType);

		const nextType = Piece.Type[Object.keys(Piece.Type)[index + 1]] ?? null;

		cell.updatePiece(PieceFactory.createPiece(nextType));
	}
}
