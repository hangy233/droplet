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
}
