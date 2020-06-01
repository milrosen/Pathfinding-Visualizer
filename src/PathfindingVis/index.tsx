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
		(twoDtoList(x + 1, y) % cols !== 0) ? twoDtoList(x + 1, y) : -1,
		twoDtoList(x, y + 1),
		twoDtoList(x, y - 1),
	];
};

const getMazeNeighbors = (index: number): number[] => {
	const { x, y } = listToTwoD(index);
	if (x === -1 || y === -1) return [-1, -1, -1, -1];
	return [twoDtoList(x - 2, y),
		(twoDtoList(x + 2, y) % cols !== 0) ? twoDtoList(x + 2, y) : -1,
		twoDtoList(x, y + 2),
		twoDtoList(x, y - 2),
	];
};

const getH = (start: number, end: number): number => {
	const { x: x1, y: y1 } = listToTwoD(start);
	const { x: x2, y: y2 } = listToTwoD(end);
	return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
	// return Math.abs(x2 - x1) + Math.abs(y2 - y1);
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
		board: ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'start', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'wall', 'empty', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'wall', 'empty', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'wall', 'wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'wall', 'wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall', 'empty', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall', 'wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'empty', 'wall', 'wall', 'empty', 'wall', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall', 'wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall', 'empty', 'wall', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall', 'wall', 'empty', 'wall', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'empty', 'end', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'] as gridSquareState[],
		mousedown: false,
		squareTypeSelection: 'start' as gridSquareState,
		isWorking: false,
	}
	private grid = React.createRef<HTMLDivElement>();

	componentDidMount(): void {
		window.addEventListener('mousedown', () => this.setState({ mousedown: true }));
		window.addEventListener('mouseup', () => this.setState({ mousedown: false }));
	}

	handleMouseOver = (index: number): void => {
		if (!this.state.mousedown || this.state.squareTypeSelection.match(/start|end/) || this.state.isWorking) return;

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
		if (this.state.isWorking) return;
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

	clearWalls = (): void => {
		this.setState({
			board: this.state.board.map(() => (
				'empty'
			)),
		});
	}

	startPathfind = (type: 0 | 1): void => {
		if (this.state.isWorking) return;
		this.setState({ isWorking: true });
		this.setState({
			board: this.state.board.map((square) => (
				square === 'visited' || square === 'path' ? 'empty' : square
			)),
		});
		const board = this.state.board;
		const start = board.indexOf('start');
		const end = board.indexOf('end');
		if (end === -1 || start === -1) {
			this.setState({ isWorking: false });
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
				this.setState({ isWorking: false });
				return;
			}

			let current = -1;
			openSet.forEach(square => {
				if (fScore.get(current) > fScore.get(square)) current = square;
			});

			if (current === end) {
				this.setState({ isWorking: false });
				window.clearInterval(intervalKey);
				this.reconstructPath(cameFrom, current);
				return;
			}

			openSet.splice(openSet.indexOf(current), 1);

			if (!board[current]?.match(/wall|start|end/)) this.updateBoard(current, 'visited');
			closedSet.push(current);

			getNeighbors(current).forEach(neighbor => {
				if (board[neighbor] === 'wall' || neighbor === -1) return;

				const tentative_gScore = gScore.get(current) + 1;

				if (closedSet.includes(neighbor) && tentative_gScore >= gScore.get(neighbor)) return;

				if (!openSet.includes(neighbor) || tentative_gScore <= gScore.get(neighbor)) {
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

	mazeRecursiveBacktracker = (): void => {
		if (this.state.isWorking) return;
		this.setState({ isWorking: true });
		// Choose the initial cell, mark it as visited and push it to the stack
		const stack: number[] = [];
		const visited: number[] = [];

		const maze: number[] = [];
		for (let i = 0; i < rows * cols; i++) {
			const { x, y } = listToTwoD(i);
			if (!(y % 2 === 0 || x % 2 === 0)) maze.push(i);
		}
		this.setState({ board: this.state.board.map(() => 'wall') });
		const initial = maze[Math.floor(Math.random() * maze.length)];

		stack.push(initial);
		visited.push(initial);

		// While the stack is not empty
		const intervalKey = window.setInterval(() => {
			if (stack.length === 0) {
				this.setState({ isWorking: false });
				window.clearInterval(intervalKey);
				window.alert('done');
				return;
			}
			// Pop a cell from the stack and make it a current cell
			const current = stack.pop();
			if (current === undefined) return;
			this.updateBoard(current, 'empty');

			// If the current cell has any neighbours which have not been visited
			let mazeNeighbors = getMazeNeighbors(current);
			mazeNeighbors = mazeNeighbors.filter(mazeNeighbor => !visited.includes(mazeNeighbor));

			if (mazeNeighbors.length === 0) return;

			// Push the current cell to the stack
			stack.push(current);

			// Choose one of the unvisited neighbours
			const chosen = mazeNeighbors[Math.floor(Math.random() * mazeNeighbors.length)];

			// Remove the wall between the current cell and the chosen cell
			const currentWalls = getNeighbors(current);
			const chosenWalls = getNeighbors(chosen);
			chosenWalls.forEach(wall => {
				if (currentWalls.includes(wall)) this.updateBoard(wall, 'empty');
			});

			// Mark the chosen cell as visited and push it to the stack
			stack.push(chosen);
			visited.push(chosen);
		}, 100);
	}

	render(): JSX.Element {
		return (
			<>
				<div className='navbar'>
					<form>
						<label className="container">Wall
							<input type='radio' value='wall' checked={this.state.squareTypeSelection === 'wall'} onChange={(e) => this.handleOptionChange(e.target)} />
							<span className="checkmark cWall"></span>
						</label>

						<label className="container">Erase
							<input type='radio' value='empty' checked={this.state.squareTypeSelection === 'empty'} onChange={(e) => this.handleOptionChange(e.target)} />
							<span className="checkmark cErase"></span>
						</label>

						<label className="container">Start
							<input type='radio' value='start' checked={this.state.squareTypeSelection === 'start'} onChange={(e) => this.handleOptionChange(e.target)} />
							<span className="checkmark cStart"></span>
						</label>

						<label className="container">End
							<input type='radio'value='end' checked={this.state.squareTypeSelection === 'end'} onChange={(e) => this.handleOptionChange(e.target)} />
							<span className="checkmark cEnd"></span>
						</label>
					</form>
					<button className='btn' onClick={() => this.startPathfind((1))}>Run A*</button>
					<button className='btn' onClick={() => this.startPathfind((0))}>Run Dijkstras</button>
					<button className='btn' onClick={() => this.clearWalls()}>Clear Walls</button>
					<button className='btn' onClick={() => this.mazeRecursiveBacktracker()}>Generate Maze</button>
				</div>
				<div className='grid' ref={this.grid}>
					{this.state.board.map((square, index) => (
						<Square type={square} handleMouseOver={this.handleMouseOver} handleClick={this.handleClick} index={index} key={index} />
					))}
				</div>
			</>);
	}
}
