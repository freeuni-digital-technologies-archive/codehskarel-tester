const { expect } = require('chai')
const root = process.env.jskarelRoot || process.cwd()
const { C } =require(`${root}/src/Karel`)
const fileReader = require(`${root}/src/karelFileReader`)
// const fileName = '../test/files/broken.k'
const fileName = `${root}/test/files/integration.k`

describe('integration file', () => {
    const config = {
        world: {
            beepers: [new C(2, 2)]
        }
    }
    try {
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
                // expect(karel.position).eql(new C(2, 1))
            })
        } catch (err) {
            it('There is a bug in the program', () => {
                expect.fail(`error: ${err}, ${karel} `)
            })
        }
    } catch (err) {
        const errLine = err.stack.split('\n')[0]
        const lineNumber = errLine.split(':')[1]
        it('There is a problem with the file', () => {
            if (err.name == "SyntaxError") {
                expect.fail(`error reading the file on line ${lineNumber}`)
            } else {
                expect.fail(`Unknown error occured: ${errLine}, ${err.message}`)
            }
        })
    }
})
