import { CellType } from "./cell";
import { ToRadians } from "./utils";


export class WaterManager {
    constructor() {
        this.startCell = undefined;
        this.grid = undefined;
        this.cells = [];
        this.sources = [];
        this.checkedCells = new Set();
        this.intervalId = 0;
        this.i = 0;
    }

    addCell(cell) {
        return;
        console.log("abc");
        this.cells.push(cell);
    }

    beginFlow(cell) {
        setTimeout(() => {
            this.startCell.addWater();
            this.startCell.full = true;
            this.sources.push(this.startCell);
            this.intervalId = setInterval(this.calculateFlow.bind(this), 1000);
        }, 1000);
        
    }

    calculateFlow() {
        if (this.sources.length === 0) {
            clearInterval(this.intervalId);
            console.log("done");
            return;
        }

        const nextSources = [];
        for (let source of this.sources) {
            console.log("next source");
            const neighbours = this.#getNeighbourCells(source);
            for (let neighbour of neighbours) {
                if (this.checkedCells.has(neighbour.cell)) {
                    continue;
                }

                let c = this.#checkForConnection(source, neighbour);
                console.log(c);
                if (c) {
                    neighbour.cell.addWater();
                    nextSources.push(neighbour.cell);
                    this.checkedCells.add(neighbour.cell);
                    console.log("god");
                }
                else {
                    console.log("bad");
                }
                
                
                //nextSources.push(neighbour.cell);
            }
            this.checkedCells.add(source);
        }
        this.sources = nextSources;
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
            const position = { x: cell.position.x + directions[direction].x, y: cell.position.y + directions[direction].y };
            const neighbour = this.grid.getCell(position);

            if (neighbour !== undefined && neighbour.type !== CellType.empty && neighbour.type !== CellType.blocked) {
                neighbours.push({ cell: neighbour, direction: directions[direction].string });
            }
        }

        return neighbours;
    }

    #checkForConnection(source, neighbour) {
        console.log(source.openings);
        console.log(neighbour.cell.openings);
        console.log(neighbour.direction);

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
}