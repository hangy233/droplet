import Piece from "./Piece.js";
import Droplet from "./Droplet.js";

export default class Cell {
	constructor(row, col, element) {
		this.row = row;
		this.col = col;
		this.element = element;
		this.pieces = [];
	}

	clearPieces() {
		this.pieces = [];
		this.updateSprit();	
	}

	setPieces(pieces) {
		this.pieces = pieces;
		this.updateSprit();	
	}

	addPieces(pieces) {
		for (const p of pieces) {
			this.pieces.push(p);
		}
		this.updateSprit();
	}

	removePieces(pieces) {
		this.pieces = this.pieces.filter((p) => pieces.indexOf(p) === -1);
		this.updateSprit();
	}

	addPiece(piece) {
		this.addPieces([piece]);
	}

	removePiece(piece) {
		this.removePieces([piece]);
	}


	updateSprit() {
		if (this.pieces[0]) {
			this.element.style.backgroundImage = `url("../droplet/static/${this.pieces[0].getSpritName()}.PNG")`;
		} else {
			this.element.style.backgroundImage = '';
		}
	}

	getPieces() {
		return this.pieces;
	}

	hasPiece(piece) {
		return this.pieces.some((p) => p === piece);
	}

	isTouchable(piece) {
		return this.pieces.every((p) => p.isTouchable(piece));
	}

	isPushable(piece) {
		return this.pieces.every((p) => p.isTouchable(piece) || p.isPushable(piece));
	}

	getPushablePieces(piece) {
		if (!this.isPushable(piece)) return [];
		return this.pieces.filter((p) => p.isPushable(piece));
	}

	getDropletPiece() {
		return this.pieces.find((p) => p.getType() === Piece.Type.DROPLET);
	}

	getMovingPieces() {
		const droplet = this.getDropletPiece();
		const otherPiece = this.pieces.find((p) => p !== droplet);
		if (droplet.getForm() === Droplet.Form.ICE && otherPiece?.getType() === Piece.Type.NET) {
			return this.pieces;
		}

		return [droplet];
	}

	getPosition() {
		return [this.row, this.col];
	}

	// @return returned droplets.
	applyTouchEffect() {
		const piecesToBeRemoved = new Set();
		let returnedDroplets = 0

		for (const touchee of this.pieces) {
			for (const toucher of this.pieces) {
				if (toucher === touchee) continue;

				if (touchee.applyTouchEffect(toucher)) {
					piecesToBeRemoved.add(toucher);
				}

				if (touchee.getType() === Piece.Type.GOAL && toucher.getType() === Piece.Type.DROPLET && toucher.getStatus() !== Droplet.Status.POLLUTED) {
					returnedDroplets += 1;
				}
			}
		}

		this.removePieces([...piecesToBeRemoved]);

		return returnedDroplets;
	}
}
