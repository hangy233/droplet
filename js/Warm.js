import Piece from "./Piece.js"

export default class Warm extends Piece {
	constructor(type) {
		super(type);
	}

	isTouchable() {
		return true;
	}

	isPushable() {
		return false;
	}
}
