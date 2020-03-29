const { expect } = require('chai')
const fileReader = require('../../src/karelFileReader')
const { C } = require('../../src/Karel')
const fileName = '../test/files/integration.k'
describe('integration file', () => {
    const config = {
        world: {
            beepers: [new C(1, 2)]
        }
    }
    const { main, world, karel } = fileReader.setUpSubmission(fileName, config)
    try {
        main()
        // console.log(karel, world)
        it('pick all beepers', () => {
            expect(world.beepers.length).equal(0)
        })
        it('shoud be on 1x1 when it ends', () => {
            expect(karel.position).eql(new C(2, 2))
        })
        it('fail test', () => {
            expect(karel.position).eql(new C(2, 1))
        })
    } catch (err) {
        it('There is a bug in the program', () => {
            expect.fail(`error: ${err}, ${karel}`)
        })
    }

})