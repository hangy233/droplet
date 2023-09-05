import Piece from "./Piece.js";

export default class Cell {
	constructor(row, col, element) {
		this.row = row;
		this.col = col;
		this.element = element;
		this.piece = null;
	}

	updatePiece(piece) {
		this.piece = piece;
		this.updateSprit();
	}

	updateSprit() {
		if (this.piece) {
			this.element.style.backgroundImage = `url("../static/${piece.getSpritName()}.PNG")`;
		} else {
			this.element.style.backgroundImage = '';
		}
	}

	getPiece() {
		return this.piece;
	}
}
