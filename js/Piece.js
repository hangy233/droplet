export default class Piece {
	static Type = {
		DROPLET: 'DROPLET',
		GOAL: 'GOAL',
		SAND: 'SAND',
		NET: 'NET',
		WALL: 'WALL',
		WARM: 'WARM',
		COLD: 'COLD',
		POLLUTION: 'POLLUTION',
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

	isTouchable() {
		return false;
	}

	isPushable() {
		return false;
	}

	// @returns {boolean} should remove toucher.
	applyTouchEffect() {
		return false;
	}
}
