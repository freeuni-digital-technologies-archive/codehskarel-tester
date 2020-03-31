const C = class {
    static fromArray(arr) {
        return new C(...arr)
    }
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    set(x, y) {
        if (y) {
            this.x = x
            this.y = y
        } else {
            this.x = x.x
            this.y = x.y
        }
    }
    move(x, y) {
        this.set(this.getNext(x, y))
    }
    getNext(x, y) {
        return new C(this.x + x, this.y + y)
    }
    equal(c) {
        return this.x == c.x && this.y == c.y
    }
    toString() {
        return `(${this.x},${this.y})`
    }
}

const Wall = class {
    /**
     * 
     * @param {C} first 
     * @param {C} second 
     */
    constructor(first, second) {
        this.first = first
        this.second = second
    }

    same(first, second) {
        return this.equal(first, second) || this.equal(second, first)
    }

    equal(first, second) {
        return this.first.equal(first) && this.second.equal(second)
    }

    static horizontalLine(start, end) {
        const edges = []
        const y = start.y
        for (let x = start.x; x < end.x; x++) {
            const first = new C(x, y - 1)
            const second = new C(x, y)
            edges.push(new Wall(first, second))
        }
        return edges
    }

    static verticalLine(start, end) {
        const edges = []
        const x = start.x
        for (let y = start.y; y < end.y; y++) {
            const first = new C(x - 1, y)
            const second = new C(x, y)
            edges.push(new Wall(first, second))
        }
        return edges
    }

    static corners(width, height) {
        return {
            lowerLeft: [1, 1],
            lowerRight: [width + 1, 1],
            topLeft: [1, height + 1],
            topRight: [width + 1, height + 1]
        }
    }

    static borders(width, height) {
        const corners = Wall.corners(width, height)
        const horizontalEdges = [
            [corners.lowerLeft, corners.lowerRight],
            [corners.topLeft, corners.topRight],
        ]
        const verticalEdges = [
            [corners.lowerLeft, corners.topLeft],
            [corners.lowerRight, corners.topRight]
        ]
        const horizontalWalls = horizontalEdges
            .map(pair => pair.map(C.fromArray))
            .map(pair => Wall.horizontalLine(...pair))
            .flat()
        const verticalWalls = verticalEdges
            .map(pair => pair.map(C.fromArray))
            .map(pair => Wall.verticalLine(...pair))
            .flat()
        return horizontalWalls
            .concat(verticalWalls)
    }
}

// starting from east, counter clockwise
const Directions = [
    [1, 0], // east
    [0, 1], // north
    [-1, 0], // west
    [0, -1], // south
]

const World = class {
    constructor(opts) {
        this.width = opts.width || 10
        this.height = opts.height || 10
        this.walls = opts.walls || []
        const borders = Wall.borders(this.width, this.height)
        this.walls = this.walls
            .concat(borders)
        if (opts.beepers && opts.beepers.length) {
            if (opts.beepers[0].set) {
                this.beepers = opts.beepers
            } else {
                this.beepers = opts.beepers.map(C.fromArray)
            }
        } else {
            this.beepers = []
        }
    }

    addBeepers(indices) {
        if (indices.length)
            indices.forEach(i => this.beepers.push(i))
        else
            this.beepers.push(indices)
        return this
    }

    addWall(wall) {
        this.walls.push(wall)
    }

    removeBeeper(c) {
        const index = this.beepers.map(x => x.equal(c)).indexOf(true)
        if (index > -1) {
            this.beepers.splice(index, 1)
        } else {
            throw "no beepers on this corner"
        }
    }

    existsWall(first, second) {
        const foundWalls = this.walls.filter(wall =>
            wall.same(first, second)
        )
        return foundWalls.length == 1
    }
}

module.exports.C = C
module.exports.World = World
module.exports.Wall = Wall
module.exports.Karel = class {
    constructor(opts) {
        this.world = opts.world || new World({})// default
        this.direction = opts.direction || 0
        if (opts.position) {
            this.position = opts.position.set ? opts.position : C.fromArray(opts.position)
        } else {
            this.position = new C(1, 1)
        }
    }
    setPosition(x, y) {
        this.position.set(x, y)
        return this
    }
    turnLeft() {
        this.direction = (this.direction + 1) % (Directions.length)
    }
    move() {
        const direction = Directions[this.direction]
        if (this.world.existsWall(this.position, this.nextCorner(direction))) {
            throw "there is a wall in front of Karel"
        } else {
            this.position.move(...direction)
        }
    }
    nextCorner(direction) {
        return this.position.getNext(...direction)
    }
    pickBeeper() {
        this.world.removeBeeper(this.position)
    }
    putBeeper() {
        this.world.addBeepers(this.position)
    }
    toString() {
        return `Karel is on position ${this.position}, coordinates of beepers: ${this.world.beepers}`
    }
}