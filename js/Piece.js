import Droplet from "./Droplet.js";
import Goal from "./Goal.js";
import Sand from "./Sand.js";
import Net from "./Net.js";
import Wall from "./Wall.js";
import Warm from "./Warm.js";
import Cold from "./Cold.js";

export default class Piece {
	static Type = {
		DROPLET: 'DROPLET',
		GOAL: 'GOAL',
		SAND: 'SAND',
		NET: 'NET',
		WALL: 'WALL',
		WARM: 'WARM',
		COLD: 'COLD',
	};

	constructor(type) {
		this.type = type;
	}

	createPiece(type) {
		switch (type) {
			case Piece.Type.DROPLET:
				return new Droplet(type);
			case Piece.Type.GOAL:
				return new Goal(type);
			case Piece.Type.SAND:
				return new Sand(type);
			case Piece.Type.NET:
				return new Net(type);
			case Piece.Type.WALL:
				return new Wall(type);
			case Piece.Type.WARM:
				return new Warm(type);
			case Piece.Type.COLD:
				return new Cold(type);
			default:
				return null;
		}
	}

	getSpritName() {
		return this.type;
	}
}
