import Piece from "./Piece.js"
import Droplet from "./Droplet.js"

export default class Pollution extends Piece {
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
		if (piece.getType() === Piece.Type.DROPLET && piece.getForm() === Droplet.Form.WATER) {
			piece.setStatus(Droplet.Status.POLLUTED);
		}
		return false;
	}
}
