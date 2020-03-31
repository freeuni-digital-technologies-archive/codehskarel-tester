const { expect } = require('chai')
const fileReader = require('../src/karelFileReader')

describe('read the file and extract non exported function', () => {
    it('add move function', () => {
        const submissionFile = process.cwd() + '/test/files/simple.k'
        const { main, world, karel } = fileReader.setUpSubmission(submissionFile, {})
        main()
        expect(karel.position).eql({ x: 3, y: 1 })
    })
    it('replace repeat and other structures', () => {
        const submissionFile = process.cwd() + '/test/files/repeat.k'
        const { main, world, karel } = fileReader.setUpSubmission(submissionFile)
        main()
        expect(karel.position).eql({ x: 3, y: 3 })
        expect(karel.world.beepers).length(3)
    })
})