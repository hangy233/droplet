import Piece from "./Piece.js"

export default class Droplet extends Piece {
	static Form = {
		WATER: 'WATER',
		ICE: 'ICE',
	};

	static Status = {
		POLLUTED: 'POLLUTED',
		NORMAL: 'NORMAL',
	};

	constructor(type) {
		super(type);
		this.isMain = false;
		this.form = Droplet.Form.WATER;
		this.status = Droplet.Status.NORMAL;
		this.formChangeInprogress = null;
	}

	isTouchable() {
		return false;
	}

	isPushable() {
		return true;
	}

	setIsMain(isMain) {
		this.isMain = isMain;
	}

	setForm(form) {
		this.form = form;
	}

	setFormChangeInprogress(form) {
		this.formChangeInprogress = form;
	}

	setStatus(status) {
		this.status = status;
	}
	
	getIsMain() {
		return this.isMain;
	}

	getForm() {
		return this.form;
	}

	getFormChangeInprogress(form) {
		return this.formChangeInprogress;
	}

	getStatus() {
		return this.status;
	}

	getSpritName() {
		return `DROPLET${this.isMain ? '_MAIN' : ''}_${this.form}_${this.status}`;
	}

	getDescription() {
		return `Droplet(${this.form})${this.isMain ? ': This is the core droplet that drives other connected droplets.' : ''}`;
	}
}
