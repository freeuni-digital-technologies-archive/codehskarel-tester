const { expect } = require('chai')
const { Karel, World, C } = require('../src/Karel')
describe('karel movement', () => {
    const karel = new Karel()
    it('moving once', () => {
        karel.move()
        expect(karel.position).eql(new C(1, 0))
    })
    it('change direcion and move', () => {
        karel.turnLeft()
        karel.move()
        expect(karel.position).eql(new C(1, 1))
    })

    it('position change', () => {
        expect(karel.setPosition(4, 5).position).eql(new C(4, 5))
    })
})

describe('beepers', () => {
    const world = new World({
        width: 5,
        height: 5,
        beepers: [new C(1, 0)]
    })
    const karel = new Karel(world)
    it('pick one beeper', () => {
        karel.move()
        karel.pickBeeper()
        expect(world.beepers.length).equal(0)
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
        world.addBeepers([new C(1,1), new C(1,1)])
        expect(world.beepers.length).equal(2)
    })
})