import { CellType } from "./cell";

export class WaterManager {
    #sources;
    #checkedCells;
    #visitedCells;
    #intervalId;
    #endGame;
    #goal;
    #longestPath;
    #onGameEndCallback;
    #onTick;

    constructor(callbacks) {
        this.startCell = undefined;
        this.grid = undefined;
        this.#sources = [];
        this.#checkedCells = new Set();
        this.#visitedCells = new Set();
        this.#intervalId = 0;
        this.#endGame = false;
        this.#goal = (Math.floor(Math.random() * 5)) + 8;
        this.#longestPath = 0;
        this.#onGameEndCallback = callbacks.onGameEnd;
        this.#onTick = callbacks.onTick;
    }

    getGoal() {
        return this.#goal;
    }

    checkForSourceConnections(cell) {
        //check for connected neighbours
        //if one is full, make 'cell' a source, after 1s
        const neighbours = this.#getNeighbourCells(cell);
        for (let neighbour of neighbours) {
            if (this.#checkForConnection(cell, neighbour) && neighbour.cell.isFull()) {
                setTimeout(() => {
                    cell.addWater();
                    this.#sources.push(cell);
                    this.#checkedCells.add(cell);
                }, 1000);
            }
        }
    }

    beginFlow() {
        setTimeout(() => {
            this.startCell.addWater();
            this.startCell.setFull();
            this.#sources.push(this.startCell);
            this.#intervalId = setInterval(this.#calculateFlow.bind(this), 1000);
        }, 1000);
        
    }

    #calculateFlow() {
        if (this.#sources.length === 0 || this.#endGame) {
            clearInterval(this.#intervalId);
            this.#onGameEndCallback(this.#longestPath >= this.#goal);
            return;
        }

        this.#longestPath = this.#findLongestPath();

        if (this.#longestPath >= this.#goal) {
            this.#endGame = true;
        }
        const nextSources = [];
        for (let source of this.#sources) {
            const neighbours = this.#getNeighbourCells(source);
            for (let neighbour of neighbours) {
                if (this.#checkedCells.has(neighbour.cell)) {
                    continue;
                }
                if (this.#checkForConnection(source, neighbour)) {
                    neighbour.cell.addWater();
                    nextSources.push(neighbour.cell);
                    this.#checkedCells.add(neighbour.cell);
                }
            }
            this.#checkedCells.add(source);
        }
        this.#sources = nextSources;
        this.#onTick(this.#longestPath);
    }

    #getNeighbourCells(cell) {
        const neighbours = [];
        const directions = {
            up: { x: 0, y: 1, string: 'up' },
            down: { x: 0, y: -1, string: 'down' },
            left: { x: -1, y: 0, string: 'left' },
            right: { x: 1, y: 0 , string: 'right'},
        };

        for (let direction in directions) {
            const cellPos = cell.getPosition();
            const position = { x: cellPos.x + directions[direction].x, y: cellPos.y + directions[direction].y };
            const neighbour = this.grid.getCell(position);

            if (neighbour !== undefined && neighbour.getType() !== CellType.empty && neighbour.getType() !== CellType.blocked) {
                neighbours.push({ cell: neighbour, direction: directions[direction].string });
            }
        }
        return neighbours;
    }

    #checkForConnection(source, neighbour) {
        if (neighbour.direction === 'up') {
            return neighbour.cell.openings[0] && source.openings[1];
        }
        else if (neighbour.direction === 'down') {
            return neighbour.cell.openings[1] && source.openings[0];
        }
        else if (neighbour.direction === 'left') {
            return neighbour.cell.openings[3] && source.openings[2];
        }
        else if (neighbour.direction === 'right') {
            return neighbour.cell.openings[2] && source.openings[3];
        }
        return false;
    }

    #dfs(cell, pathLength) {
        this.#visitedCells.add(cell);
        let longestPath = pathLength;
        const neighbours = this.#getNeighbourCells(cell);
        for (let neighbour of neighbours) {
            if (!this.#visitedCells.has(neighbour.cell) && this.#checkForConnection(cell, neighbour) && cell.isFull()) {
                const currentPath = this.#dfs(neighbour.cell, pathLength + 1);
                longestPath = Math.max(longestPath, currentPath);
            }
        }
        this.#visitedCells.delete(cell);
        return longestPath;
    }

    #findLongestPath() {
        this.#visitedCells.clear();
        return this.#dfs(this.startCell, 0);
    }
}