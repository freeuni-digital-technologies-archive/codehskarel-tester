const { expect } = require('chai')
const fileReader = require('../src/karelFileReader')

describe('read the file and extract non exported function', () => {
    it('add move function', () => {
        // ./test does not work because rewire is called in another dir
        // absolute path from root is better
        const submissionFile = '../test/files/simple.k'
        const { main, world, karel } = fileReader.setUpSubmission(submissionFile, {})
        main()
        expect(karel.position).eql({x: 2, y: 0})
    })
})