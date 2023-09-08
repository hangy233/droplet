import Piece from "./Piece.js"
import Droplet from "./Droplet.js"

export default class Goal extends Piece {
	constructor(type) {
		super(type);
	}

	isTouchable(piece) {
		return piece.getType() === Piece.Type.DROPLET && piece.getStatus() !== Droplet.Status.POLLUTED;
	}

	isPushable() {
		return false;
	}
}
