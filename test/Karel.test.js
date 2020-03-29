const { expect } = require('chai')
const { Karel, Wall, World, C } = require('../src/Karel')
describe('karel movement', () => {
    const karel = new Karel({})
    it('moving once', () => {
        karel.move()
        expect(karel.position).eql(new C(2, 1))
    })
    it('change direction and move', () => {
        karel.turnLeft()
        karel.move()
        expect(karel.position).eql(new C(2, 2))
        karel.turnLeft()
        karel.turnLeft()
        karel.turnLeft()
        karel.move()
        expect(karel.position).eql(new C(3, 2))
    })

    it('position change', () => {
        expect(karel.setPosition(4, 5).position).eql(new C(4, 5))
    })
})

describe('beepers', () => {
    const world = new World({
        width: 5,
        height: 5,
        beepers: [new C(2, 1)]
    })
    const karel = new Karel({ world: world })
    it('pick one beeper', () => {
        karel.move()
        karel.pickBeeper()
        expect(world.beepers.length).equal(0)
        expect(karel.position).eql(new C(2, 1))
    })
    it('throw error if there is no beeper', () => {
        expect(() => karel.pickBeeper()).to.throw("no beepers")
    })
    it('add beepers', () => {
        karel.putBeeper()
        karel.putBeeper()
        karel.pickBeeper()
        expect(world.beepers.length).equal(1)
        karel.pickBeeper()
        expect(world.beepers.length).equal(0)
    })
    it('add multiple beepers at once', () => {
        world.addBeepers([new C(2, 2), new C(3, 3)])
        expect(world.beepers.length).equal(2)
    })
    it('world with empty beepers', () => {
        const world = new World({})
        expect(world.beepers.length).equal(0)
    })
})

describe('walls', () => {
    const world = new World({
        width: 3,
        height: 3
    })
    it('add walls for edges', () => {
        expect(world.walls.length).equal(12)
    })
    const karel = new Karel({
        world: world
    })
    it('karel cannot move past walls', () => {
        karel.move()
        karel.move()
        expect(() => karel.move()).to.throw("hit an edge")
        expect(karel.position).eql(new C(3,1))
    })
    it('another check for vertical walls', () => {
        karel.turnLeft()
        karel.move()
        karel.move()
        expect(karel.position).eql(new C(3,3))
        expect(() => karel.move()).to.throw("hit an edge")
    })
    it('walls can be within the world as well', () => {
        world.addWall(new Wall(new C(3,3), new C(2, 3)))
        karel.turnLeft()
        expect(() => karel.move()).to.throw("hit an edge")
    })
})