import Cell from './Cell.js';
import Piece from './Piece.js';
import PieceFactory from './PieceFactory.js';
import Droplet from "./Droplet.js";

export default class Game {
	static Mode = {EDIT: 'EDIT', PLAY: 'PLAY'};

	constructor(boardSize = 800, boardRows = 20, boardCols = 20) {
		this.container = document.getElementById('main-container');
		this.controlPanel = document.getElementById('control-panel');
		this.editButton = document.getElementById('edit');
		this.playButton = document.getElementById('play');
		this.gameDesc =  document.getElementById('game-desc');
		this.download =  document.getElementById('download');
		this.exportButton = document.getElementById('export');
		this.importButton = document.getElementById('import');
		this.fileElem = document.getElementById('fileElem');
		this.targetDropletsInput = document.getElementById('target');
		this.collectedDisplay = document.getElementById('collected');
		this.brushesContainer = document.getElementById('brushes');
		this.brushDesc = document.getElementById('brush-desc');
		this.arrows = document.getElementById('arrows');
		this.up = document.getElementById('up');
		this.down = document.getElementById('down');
		this.left = document.getElementById('left');
		this.right = document.getElementById('right');
		this.gameEnd = false;
		this.targetDroplets = this.targetDropletsInput.value;
		this.returnedDroplets = 0;
		this.selectedBrush = null;
		this.boardSize = boardSize;
		this.boardRows = boardRows;
		this.boardCols = boardCols;
		this.cells = new Map();
		this.mode = Game.Mode.EDIT;
		this.keyDown = false;
		this.initEmptyBoard();
		this.initBrushes();
		this.editButton.addEventListener('click', () => this.changeMode(Game.Mode.EDIT));
		this.playButton.addEventListener('click', () => this.changeMode(Game.Mode.PLAY));
		this.exportButton.addEventListener('click', () => this.exportBoard());

		this.importButton.addEventListener(
		  "click",
		  (e) => {
		    if (this.fileElem) {
		      this.fileElem.click();
		    }
		    e.preventDefault(); // prevent navigation to "#"
		  },
		  false,
		);

		this.fileElem.addEventListener("change", () => this.handleFiles(), false);
		this.container.addEventListener('click', (e) => this.handleClickBoard(e));
		this.targetDropletsInput.addEventListener('change', (e) => this.targetDroplets = this.targetDropletsInput.value);
		this.brushesContainer.addEventListener('click', (e) => this.handleClickBrushes(e));
		this.arrows.addEventListener('click', (e) => this.handleArrowCLick(e));
		window.addEventListener('keydown', (e) => this.handleKeyDown(e));
		window.addEventListener('keyup', (e) => this.handleKeyUp(e));
	}

	changeMode(mode) {
		if (this.mode === mode) return;
		this.mode = mode;
		switch (mode) {
			case Game.Mode.EDIT:
				this.editButton.setAttribute('disabled', '');
				this.playButton.removeAttribute('disabled');
				this.importButton.removeAttribute('disabled');
				this.exportButton.removeAttribute('disabled');
				this.targetDropletsInput.removeAttribute('disabled');
				this.brushesContainer.classList.remove('disabled');
				this.brushDesc.classList.remove('disabled');
				this.gameDesc.textContent = "Editing."
				return;
			case Game.Mode.PLAY:
				this.playButton.setAttribute('disabled', '');
				this.editButton.removeAttribute('disabled');
				this.importButton.setAttribute('disabled', '');
				this.exportButton.setAttribute('disabled', '');
				this.targetDropletsInput.setAttribute('disabled', '');
				this.brushesContainer.classList.add('disabled');
				this.brushDesc.classList.add('disabled');
				this.gameEnd = false;
				this.returnedDroplets = 0;
				this.collectedDisplay.textContent = '0';
				this.gameDesc.textContent = "Game start."
				return;
			default:
				return;
		}
	}

	initFromJson(boardStr) {
		let boardObj;
		try {
			boardObj = JSON.parse(boardStr);
		} catch (e) {
			alert("import failed");
		}

		this.init(boardObj.size, boardObj.rows, boardObj.cols, boardObj.cells, boardObj.targetDroplets);
		this.fileElem.value = '';
	}

	init(size, rows, cols, cells, targetDroplets = 1) {
		this.boardSize = size;
		this.boardRows = rows;
		this.boardCols = cols;
		this.cells = new Map();
		this.mode = Game.Mode.EDIT;
		this.targetDroplets = targetDroplets;
		this.targetDropletsInput.value = targetDroplets;
		this.gameEnd = false;
		this.returnedDroplets = 0;
		this.collectedDisplay.textContent = '0';
		this.container.innerHTML = '';
		for (let i = 0; i < this.boardRows; i++) {
			for (let j = 0; j < this.boardCols; j++) {
				const hash = `${i}-${j}`;
				const cellElem = document.createElement('div');
				cellElem.setAttribute('id', hash);
				cellElem.setAttribute('class', `cell`);
				const cell = new Cell(i, j, cellElem);
				const cellObj = cells[i * rows + j];
				for (const p of cellObj.pieces) {
					const pieceFromObj = PieceFactory.createPiece(p.pieceType);
					if (pieceFromObj) {
						if (pieceFromObj.getType() === Piece.Type.DROPLET) {
							if (p.isMain) {
								pieceFromObj.setIsMain(true);
							}
							if (p.form) {
								pieceFromObj.setForm(p.form);
							}
							if (p.status) {
								pieceFromObj.setStatus(p.status);
							}
						}
						cell.addPiece(pieceFromObj);
					}
				}

				this.cells.set(hash, cell);
				this.container.append(cellElem);
			}
		}
	}

	initEmptyBoard() {
		for (let i = 0; i < this.boardRows; i++) {
			for (let j = 0; j < this.boardCols; j++) {
				const hash = `${i}-${j}`;
				const cell = document.createElement('div');
				cell.setAttribute('id', hash);
				cell.setAttribute('class', `cell`);
				this.cells.set(hash, new Cell(i, j, cell));
				this.container.append(cell);
			}
		}
	}

	initBrushes() {
		this.createBrush('');
		for (const type of Object.values(Piece.Type)) {
			if (type === Piece.Type.DROPLET) {
				for (const form of Object.values(Droplet.Form)) {
					this.createBrush(type, form, Droplet.Status.NORMAL, true);
					this.createBrush(type, form, Droplet.Status.NORMAL, false);
				}
			} else {
				this.createBrush(type);
			}
		}

		this.selectBrush(document.querySelectorAll('.brush')[1]);
		document.querySelector('.brush[data-type="POLLUTION"]')?.classList.add('disabled');
	}

	createBrush(type, form, status, isMain, isSelected) {
		const div = document.createElement('div');
		div.classList.add('brush');
		if (isSelected) {
			div.classList.add('selected');
		}
		div.dataset.type = type;
		if (type === Piece.Type.DROPLET) {
			div.dataset.form = form;
			div.dataset.status = status;
			div.dataset.isMain = isMain;
		}

		const cell = new Cell(-1, -1, div);
		const piece = PieceFactory.createPiece(type);
		if (type === Piece.Type.DROPLET) {
			piece.setForm(form);
			piece.setStatus(status);
			piece.setIsMain(isMain);
		}
		cell.addPiece(piece);

		this.brushesContainer.append(div);
		return div;
	}

	selectBrush(newBrush) {
		if (!newBrush) return;
		if (!newBrush.classList.contains('brush')) return;
		if (newBrush.classList.contains('disabled')) return;

		this.selectedBrush?.classList.remove('selected');		
		this.selectedBrush = newBrush;
		this.selectedBrush.classList.add('selected');

		const piece = this.createPieceFromSelectedBrush();
		this.brushDesc.textContent = piece ? piece.getDescription() : 'Empty piece.';
	}

	createPieceFromSelectedBrush() {
		const type = this.selectedBrush.dataset.type;
		const form = this.selectedBrush.dataset.form;
		const status = this.selectedBrush.dataset.status;
		const isMain = this.selectedBrush.dataset.isMain === 'true';

		const piece = PieceFactory.createPiece(type);
		if (type === Piece.Type.DROPLET) {
			piece.setForm(form);
			piece.setStatus(status);
			piece.setIsMain(isMain);
		}

		return piece;
	}

	handleClickBrushes(event) {
		if (!event.target.classList.contains('brush')) return;
		this.selectBrush(event.target);
	}

	handleClickBoard(event) {
		if (!event.target.classList.contains('cell')) return;
		const hash = event.target.id;
		const cell = this.cells.get(hash);
		switch (this.mode) {
			case Game.Mode.EDIT:
				this.editPiece(cell);
				return;
			default:
				return;
		} 
	}

	editPiece(cell) {
		const piece = this.createPieceFromSelectedBrush();

		cell.clearPieces();
		if (piece) {
			cell.addPiece(piece);
		}
	}

	exportBoard() {
		const boardObj = {rows: this.boardRows, cols: this.boardCols, size: this.boardSize, cells: [], targetDroplets: this.targetDroplets};

		for (let i = 0; i < this.boardRows; i++) {
			for (let j = 0; j < this.boardCols; j++) {
				const hash = `${i}-${j}`;
				const cell = this.cells.get(hash);
				const pieces = cell.getPieces().map((p) => {
					const obj = {
						pieceType: p.getType() ?? null,
					}
					if (p.getType() === Piece.Type.DROPLET) {
						obj.isMain = p.getIsMain();
						obj.form = p.getForm();
						obj.status = p.getStatus();
					}
					return obj;
				});
				const cellObj = {pieces};

				boardObj.cells.push(cellObj);
			}
		}

		const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(boardObj));
		this.download.setAttribute("href", dataStr);
		this.download.setAttribute("download", "board.json");
		this.download.click();
	}

	handleFiles() {
		for (const file of this.fileElem.files) {
		    const reader = new FileReader();
		    reader.onload = (evt) => this.initFromJson(evt.target.result);
			reader.readAsBinaryString(file);
		}
	}

	handleKeyDown(event) {
		if (this.mode !== Game.Mode.PLAY) return;
		if (this.keyDown) return;
		if (this.gameEnd) return;
		this.keyDown = true;

		let vector = [0, 0];
		switch (event.key) {
			case 'ArrowUp':
				vector = [-1, 0];
				this.up.classList.add('pressed');
				break;
			case 'ArrowDown':
				vector = [1, 0];
				this.down.classList.add('pressed');
				break;
			case 'ArrowLeft':
				vector = [0, -1];
				this.left.classList.add('pressed');
				break;
			case 'ArrowRight':
				vector = [0, 1];
				this.right.classList.add('pressed');
				break;
			default:
				break;
		}

		const cellsToMove = this.findCellsToMove(vector);
		this.tryMove(cellsToMove, vector);
		this.handleTurnEnd();
	}

	handleArrowCLick(event) {
		if (this.mode !== Game.Mode.PLAY) return;
		if (this.keyDown) return;
		if (this.gameEnd) return;

		let vector = [0, 0];
		switch (event.target) {
			case this.up:
				vector = [-1, 0];
				break;
			case this.down:
				vector = [1, 0];
				break;
			case this.left:
				vector = [0, -1];
				break;
			case this.right:
				vector = [0, 1];
				break;
			default:
				break;
		}

		const cellsToMove = this.findCellsToMove(vector);
		this.tryMove(cellsToMove, vector);
		this.handleTurnEnd();
	}

	handleKeyUp() {
		this.keyDown = false;
		this.up.classList.remove('pressed');
		this.left.classList.remove('pressed');
		this.right.classList.remove('pressed');
		this.down.classList.remove('pressed');
	}

	tryMove(cells, vector) {
		const sorted = [...cells].sort((a, b) => vector[0] * (b.row - a.row) + vector[1] * (b.col - a.col));
		for (const cell of sorted) {
			if (!cell.getPieces().length) continue;
			this.maybePush(cell, vector);
			this.maybeMove(cell, cell.getMovingPieces(), vector);
		}
	}

	findRelativeCell(startCell, vector) {
		const [cr, cc] = startCell.getPosition();
		const [tr, tc] = [cr + vector[0], cc + vector[1]];
		return this.cells.get(`${tr}-${tc}`);
	}

	maybePush(cellToPush, vector) {
		const cellToBePushed = this.findRelativeCell(cellToPush, vector);
		if (!cellToBePushed) return;

		const piecesToPush = cellToPush.getMovingPieces();
		const piecesToBePushed = new Set();

		for (const pieceToPush of piecesToPush) {
			for (const pieceToBePushed of cellToBePushed.getPushablePieces(pieceToPush)) {
				piecesToBePushed.add(pieceToBePushed);
			}
		}

		if (!this.canBePushedTo(cellToBePushed, [...piecesToBePushed], vector)) return;

		this.maybeMove(cellToBePushed, [...piecesToBePushed], vector);
	}

	maybeMove(cellToMove, pieces, vector) {
		const targetCell = this.findRelativeCell(cellToMove, vector);
		if (!targetCell) return;
		if (targetCell.getPieces().length === 0) {
			cellToMove.removePieces(pieces);
			targetCell.addPieces(pieces);
			return;
		}

		// Move any pieces that can be moved. May not work for ice+net case if anything is touchable by one but not the other.
		const piecesToBeMoved = [];
		for (const p of pieces) {
			if (targetCell.isTouchable(p)) {
				piecesToBeMoved.push(p);
			}
		}

		cellToMove.removePieces(piecesToBeMoved);
		targetCell.addPieces(piecesToBeMoved);
	}

	handleTurnEnd() {
		// step on conflict form changes does nothing.
		this.applyTouchEffect();
		this.spreadFormChangeOfTouch();
		this.spreadFormChangeOfAdjacant();
		for (const [, cell] of this.cells) {
			cell.updateSprit();
		}
		this.checkWin();
	}

	applyTouchEffect() {
		for (const [, cell] of this.cells) {
			this.returnedDroplets += cell.applyTouchEffect();
		}
		this.collectedDisplay.textContent = this.returnedDroplets.toString();
	}

	spreadFormChangeOfAdjacant() {
		const pools = this.findPools();
		for (const pool of pools) {
			const form = this.getNextFormOfAdjacant(pool);
			if (!form) continue;
			for (const cell of pool) {
				cell?.getDropletPiece()?.setForm(form);
			}
		}
	}

	getNextFormOfAdjacant(pool) {
		let nextForm = null;

		for (const cell of pool) {
			if (cell?.getDropletPiece()?.getIsMain()) {
				if (nextForm === null) {
					nextForm = cell?.getDropletPiece()?.getForm();
				} else if (nextForm !== cell?.getDropletPiece()?.getForm()) {
					return null;
				}
			}
		}

		return nextForm;
	}

	spreadFormChangeOfTouch() {
		const pools = this.findPools();
		for (const pool of pools) {
			const form = this.getNextFormOfTouch(pool);
			if (!form) continue;
			for (const cell of pool) {
				cell?.getDropletPiece()?.setForm(form);
				cell?.getDropletPiece()?.setFormChangeInprogress(null);
			}
		}
	}

	getNextFormOfTouch(pool) {
		let nextForm = null;

		for (const cell of pool) {
			if (cell?.getDropletPiece()?.getFormChangeInprogress()) {
				if (nextForm && nextForm !== cell?.getDropletPiece()?.getFormChangeInprogress()) {
					return null;
				}
				nextForm = cell?.getDropletPiece()?.getFormChangeInprogress();
			}
		}

		return nextForm;
	}

	checkWin() {
		if (this.returnedDroplets >= this.targetDroplets) {
			// Game.
			this.gameEnd = true;
			this.gameDesc.textContent = "Stage clear."
		}
	}

	findPool(startCell, res = new Set()) {
		if (!startCell || !startCell.getDropletPiece()) return;
		if (res.has(startCell)) return;

		res.add(startCell);

		const fourDirections = [[-1,0],[1,0],[0,-1],[0,1]];

		for (const [row, col] of fourDirections) {
			const hash = `${row + startCell.getPosition()[0]}-${col + startCell.getPosition()[1]}`;
			const checkingCell = this.cells.get(hash);

			this.findPool(checkingCell, res);
		}
	}

	findMainDropletCells() {
		const res = [];
		for (var [key, cell] of this.cells) {
			if (cell.getDropletPiece()?.getIsMain()) {
				res.push(cell);
			}
		}
		return res;
	}

	findPools() {
		return this.findMainDropletCells().map((mainDropletCell) => {
			const pool = new Set();
			this.findPool(mainDropletCell, pool);
			return pool;
		}).reduce((accumulator, currentValue) => {
			for (const pool of accumulator) {
				if (currentValue.has([...pool][0])) {
					return accumulator;
				}
			}
			accumulator.push([...currentValue]);
			return accumulator;
		}, []);
	}

	findPoolPioneers(pool, vector) {
		return pool.filter((cell) => {
			const targetCell = this.findRelativeCell(cell, vector);
			return !targetCell.getDropletPiece()
		});
	}

	canBePushedTo(cellToBePushed, piecesToBePushed, vector) {
		const target = this.findRelativeCell(cellToBePushed, vector);
		if (!target) return false;
		if (target.getPieces().length === 0) return true;
		return piecesToBePushed.length && piecesToBePushed.every((piece) => target.isTouchable(piece));
	}

	findCellsToMove(vector) {
		return this.findPools().filter((pool) => {
			if (pool[0].getDropletPiece().getForm() === Droplet.Form.ICE) {
				const pioneers = this.findPoolPioneers(pool, vector);
				return pioneers.every((cell) => {
					const targetCell = this.findRelativeCell(cell, vector);
					if (!targetCell) return false;
					if (targetCell.getPieces().length === 0) return true;
					if (targetCell.isTouchable(cell.getDropletPiece())) return true;

					const piecesToBePushed = targetCell.getPushablePieces(cell.getDropletPiece());
					if (piecesToBePushed.length === 0) return false;
					return this.canBePushedTo(targetCell, piecesToBePushed, vector);
				});
			}
			return true;
		}).reduce((res, pool) => {
			for (const cell of pool) {
				res.push(cell);
			}
			return res;
		}, []);
	}
}
