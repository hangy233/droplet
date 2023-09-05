export default class Init {
	init() {
		this.container = document.getElementById('main-container');
		this.initBoard();
	}

	initBoard(row = 20, column = 20) {
		for (let i = 0; i < row; i++) {
			for (let j = 0; j < column; j++) {
				const cell = document.createElement('div');
				cell.setAttribute('id', `${i}-${j}`);
				cell.setAttribute('class', `cell`);
				this.container.append(cell);
			}
		}

	}
}
