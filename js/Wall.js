import Piece from "./Piece.js"

export default class Wall extends Piece {
	constructor(type) {
		super(type);
	}

	isTouchable() {
		return false;
	}

	isPushable() {
		return false;
	}
}
