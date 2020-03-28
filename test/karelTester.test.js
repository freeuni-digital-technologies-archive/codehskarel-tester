const { expect } = require('chai')

const tester = require('../src/karelTester')
const { World, C } = require('../src/Karel')
describe('read file and check if it works correctly', () => {
    it('move and pick beeper', () => {
        const world = new World({})
        world.addBeepers(new C(1,1))
        tester.testFile('../test/files/integration.k', world)
        expect(world.beepers.length).equal(0)        
    })
})