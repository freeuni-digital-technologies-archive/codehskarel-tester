const C = class {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    set(x, y) {
        this.x = x
        this.y = y
    }
    move(x, y) {
        this.set(this.x + x, this.y = this.y + y)
    }

}

// starting from east, counter clockwise
const Directions = [
    [1, 0], // east
    [0, 1], // north
    [-1, ], // west
    [0, -1], // south
]

const World = class {
    constructor(opts) {
        this.width = opts.width
        this.height = opts.height
        this.beepers = []
    }

    withBeepers(indices) {
        if (indices.lengths) 
            indices.forEach(i => this.beepers.push(i))
        else
            this.beepers.push(indices)
        return this
    }

    withWalls() {

    }
}

module.exports.C = C
module.exports.World = World
module.exports.Karel = class {
    constructor(world) {
        this.world = world
        this.direction = 0
        this.position = new C(0, 0)
    }
    withPosition(x, y) {
        this.position.set(x, y)
        return this
    }
    turnLeft() {
        this.direction = (this.direction + 1) % (Directions.length - 1)
    }
    move() {
        const direction = Directions[this.direction]
        this.position.move(...direction)
    }
}