import Piece from "./Piece.js"

export default class Cold extends Piece {
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
		if (piece.getType() === Piece.Type.DROPLET && piece.getForm() === Piece.Form.WATER) {
			piece.setForm(Piece.Form.ICE);
		}
		return false;
	}
}
