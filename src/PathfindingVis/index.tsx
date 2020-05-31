import React, { Component } from 'react';
import './index.css';
import Square from './square';
import { gridSquareState } from './namespace';

const rows = 15;
const cols = 35;

const sqrs: gridSquareState[] = [];
for (let i = 0; i < cols * rows; i++) {
	sqrs.push('empty');
}

const twoDtoList = (x: number, y: number): number => {
	if (x < 0 || y < 0 || x + cols * y > rows * cols) return -1;
	return x + cols * y;
};

const listToTwoD = (index: number): { x: number, y: number } => {
	if (index > rows * cols) return { x: -1, y: -1 };
	return { x: index % cols, y: Math.floor(index / cols) };
};

const getNeighbors = (index: number): number[] => {
	const { x, y } = listToTwoD(index);
	if (x === -1 || y === -1) return [-1, -1, -1, -1];
	return [twoDtoList(x - 1, y),
		(twoDtoList(x + 1, y) % 35 !== 0) ? twoDtoList(x + 1, y) : -1,
		twoDtoList(x, y + 1),
		twoDtoList(x, y - 1),
	];
};

const getH = (start: number, end: number): number => {
	const { x: x1, y: y1 } = listToTwoD(start);
	const { x: x2, y: y2 } = listToTwoD(end);
	return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

class MapWithDefault<K, V> extends Map<K, V> {

	default: V;

	get(key: K) {
		const potentialReturn = super.get(key);
		return potentialReturn !== undefined ? potentialReturn : this.default;
	}

	constructor(defaultValue: V, entries: Map<K, V> = new Map()) {
		super(entries);
		this.default = defaultValue;
	}
}

export default class PathfindingVis extends Component {

	state = {
		board: sqrs,
		mousedown: false,
		squareTypeSelection: 'start' as gridSquareState,
		isPathfinding: false,
	}
	private grid = React.createRef<HTMLDivElement>();

	componentDidMount(): void {
		window.addEventListener('mousedown', () => this.setState({ mousedown: true }));
		window.addEventListener('mouseup', () => this.setState({ mousedown: false }));
	}

	handleMouseOver = (index: number): void => {
		if (!this.state.mousedown || this.state.squareTypeSelection.match(/start|end/) || this.state.isPathfinding) return;

		this.updateBoard(index, this.state.squareTypeSelection);
	};

	updateBoard = (index: number, value: gridSquareState): void => {
		this.setState({
			board: this.state.board.map((square, i) => (
				index === i ? value : square
			)),
		});
	}

	updateBatch = (indexes: number[], value: gridSquareState): void => {
		this.setState({
			board: this.state.board.map((square, i) => (
				indexes.includes(i) ? value : square
			)),
		});
	}

	handleClick = (index: number): void => {
		if (this.state.isPathfinding) return;
		this.setState({
			board: this.state.board.map((square, i) => {
				let newSquare = square;
				if (this.state.squareTypeSelection === 'start' && square === 'start' && index !== i) newSquare = 'empty';
				if (this.state.squareTypeSelection === 'end' && square === 'end' && index !== i) newSquare = 'empty';
				if (square === 'visited' || square === 'path') newSquare = 'empty';
				if (index === i) newSquare = this.state.squareTypeSelection;
				return newSquare;
			}),
		});
	}

	handleOptionChange = (target: HTMLInputElement): void => {
		this.setState({
			squareTypeSelection: target.value,
		});
	}

	// end react functions and begin pathfinding functions

	reconstructPath = (cameFrom: Map<number, number>, current: number): void => {
		const totalPath = [current];
		while (cameFrom.has(current)) {
			const potentialCurrent = cameFrom.get(current);
			if (potentialCurrent !== undefined) current = potentialCurrent;
			totalPath.push(current);
		}
		totalPath.splice(totalPath.indexOf(this.state.board.indexOf('start')), 1);
		totalPath.splice(totalPath.indexOf(this.state.board.indexOf('end')), 1);
		this.updateBatch(totalPath, 'path');
	}


	startPathfind = (type: 0 | 1): void => {
		if (this.state.isPathfinding) return;
		this.setState({ isPathfinding: true });
		this.setState({
			board: this.state.board.map((square) => (
				square === 'visited' || square === 'path' ? 'empty' : square
			)),
		});
		const board = this.state.board;
		const start = board.indexOf('start');
		const end = board.indexOf('end');
		if (end === -1 || start === -1) {
			this.setState({ isPathfinding: false });
			window.alert('please choose a start and end tile');
			return;
		}
		const openSet: number[] = [];
		openSet.push(start);
		const closedSet: number[] = [];

		const cameFrom = new Map();

		const gScore = new MapWithDefault<number, number>(Infinity);
		gScore.set(start, 0);
		const fScore = new MapWithDefault<number, number>(Infinity);
		fScore.set(start, getH(start, end) * type);

		const intervalKey = window.setInterval(() => {
			if (openSet.length === 0) {
				window.clearInterval(intervalKey);
				setTimeout(() => {
					window.alert('no possible path');
				}, 500);
				this.setState({ isPathfinding: false });
				return;
			}

			let current = -1;
			openSet.forEach(square => {
				if (fScore.get(current) > fScore.get(square)) current = square;
			});

			if (current === end) {
				this.setState({ isPathfinding: false });
				window.clearInterval(intervalKey);
				this.reconstructPath(cameFrom, current);
				return;
			}

			openSet.splice(openSet.indexOf(current), 1);

			if (!board[current]?.match(/wall|start|end/)) this.updateBoard(current, 'visited');
			closedSet.push(current);

			getNeighbors(current).forEach(neighbor => {
				if (closedSet.includes(neighbor) || board[neighbor] === 'wall' || neighbor === -1) return;

				const tentative_gScore = gScore.get(current);

				if (tentative_gScore < gScore.get(neighbor)) {
					cameFrom.set(neighbor, current);
					gScore.set(neighbor, tentative_gScore);
					fScore.set(neighbor, gScore.get(neighbor) + getH(neighbor, end) * type);
					if (!openSet.includes(neighbor)) {
						openSet.push(neighbor);
					}
				}
			});
		}, 50);

	}

	render(): JSX.Element {
		return (
			<>
				<form>
					<input type='radio' id='wall' name='square-type' value='wall' checked={this.state.squareTypeSelection === 'wall'} onChange={(e) => this.handleOptionChange(e.target)} />
					<label htmlFor='wall'>Wall</label>
					<input type='radio' id='empty' name='square-type' value='empty' checked={this.state.squareTypeSelection === 'empty'} onChange={(e) => this.handleOptionChange(e.target)} />
					<label htmlFor='wall'>Empty</label>
					<input type='radio' id='start' name='square-type' value='start' checked={this.state.squareTypeSelection === 'start'} onChange={(e) => this.handleOptionChange(e.target)} />
					<label htmlFor='wall'>Start</label>
					<input type='radio' id='end' name='square-type' value='end' checked={this.state.squareTypeSelection === 'end'} onChange={(e) => this.handleOptionChange(e.target)} />
					<label htmlFor='wall'>End</label>
				</form>
				<button onClick={() => this.startPathfind((1))}>Run A*</button>
				<button onClick={() => this.startPathfind((0))}>Run Dijkstras</button>
				<div className='grid' ref={this.grid}>
					{this.state.board.map((square, index) => (
						<Square type={square} handleMouseOver={this.handleMouseOver} handleClick={this.handleClick} index={index} key={index} />
					))}
				</div>
			</>);
	}
}
