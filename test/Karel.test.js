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
        expect(karel.withPosition(4, 5).position).eql(new C(4, 5))
    }) 
})
