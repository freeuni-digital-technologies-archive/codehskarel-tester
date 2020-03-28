const { expect } = require('chai')
const fileReader = require('../../src/karelFileReader')
const { C } = require('../../src/Karel')
const fileName = '../test/files/integration.k'
describe.only('integration file', () => {
    const config = {
        world: {
            beepers: [new C(1, 1)]
        }
    }
    const { main, world, karel } = fileReader.setUpSubmission(fileName, config)
    main()
    // console.log(karel, world)
    it('should put beeper and pick up both beepers from 1x1', () => {
        expect(world.beepers.length).equal(0)
        expect(karel.position).eql(new C(1, 1))
    })
})