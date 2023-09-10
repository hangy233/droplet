import Piece from "./Piece.js"
import Droplet from "./Droplet.js"

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
		if (piece.getType() === Piece.Type.DROPLET) {
			piece.setFormChangeInprogress(Droplet.Form.WATER);
		}
		return false;
	}
}
