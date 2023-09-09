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

	applyTouchEffect(piece) {
		if (piece.getType() === Piece.Type.Droplet && piece.getForm() === Piece.Form.ICE) {
			piece.setForm(Piece.Form.WATER);
		}
		return false;
	}
}
