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
        return [
            [1, 1], // lowerLeft
            [width + 1, 1], // lowerRight
            [1, height + 1], // topLeft
            [width + 1, height + 1] // topRight
        ]
    }

    static line(p1, p2) {
        if (p1.x == p2.x) {
            return Wall.verticalLine(p1, p2)
        } else if (p1.y == p2.y) {
            return Wall.horizontalLine(p1, p2)
        }
        return []
    }

    static borders(width, height) {
        const corners = this.corners(width, height).map(C.fromArray)
        return corners
            .map(p1 => corners.map(p2 => this.line(p1, p2)))
            .flat()
            .flat()
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
        this.walls = []
        const walls = opts.walls || []
        walls.forEach(wall => {
            if (wall.first && wall.second) {
                this.walls.push(wall)
            } else {
                const [ first, second ] = wall.map(C.fromArray)
                this.walls.push(new Wall(first, second))
            }
        })
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
        if (opts.world) {
            if (opts.world.existsWall) {
                this.world = opts.world
            } else {
                this.world = new World(opts.world)
            }
        } else {
            this.world = new World({})
        }
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
        if (this.frontIsClear()) {
            this.position.move(...direction)
        } else {
            throw "there is a wall in front of Karel"
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
    frontIsClear() {
        const direction = Directions[this.direction]
        return !this.world.existsWall(this.position, this.nextCorner(direction))
    }
}