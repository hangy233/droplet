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

	getSpritName() {
		return this.type;
	}

	getType() {
		return this.type;
	}
}
