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
    equal(c) {
        return this.x = c.x && this.y == c.y
    }

}

// starting from east, counter clockwise
const Directions = [
    [1, 0], // east
    [0, 1], // north
    [-1,], // west
    [0, -1], // south
]

const World = class {
    constructor(opts) {
        this.width = opts.width
        this.height = opts.height
        this.beepers = opts.beepers || []
    }

    addBeepers(indices) {
        if (indices.length)
            indices.forEach(i => this.beepers.push(i))
        else
            this.beepers.push(indices)
        return this
    }

    removeBeeper(c) {
        const index = this.beepers.map(x => x.equal(c)).indexOf(true)
        if (index > -1) {
            this.beepers.splice(index, 1)
        } else {
            throw "no beepers"
        }
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
    setPosition(x, y) {
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
    pickBeeper() {
        this.world.removeBeeper(this.position)
    }
    putBeeper() {
        this.world.addBeepers(this.position)
    }
}