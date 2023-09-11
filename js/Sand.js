import Piece from "./Piece.js"
import Droplet from "./Droplet.js"

export default class Sand extends Piece {
	constructor(type) {
		super(type);
	}

	isTouchable(piece) {
		return piece.getType() === Piece.Type.DROPLET && piece.getForm() === Droplet.Form.WATER;
	}

	isTouchable(piece) {
		return piece.getType() === Piece.Type.DROPLET && piece.getForm() === Droplet.Form.ICE;
	}

	applyTouchEffect(piece) {
		if (piece.getType() === Piece.Type.DROPLET && piece.getForm() === Piece.Form.WATER) {
			return true;
		}
		return false;
	}

	getDescription() {
		return 'Sand: Absorbs water.';
	}
}
