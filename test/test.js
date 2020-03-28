const { expect } = require('chai')
// https://stackoverflow.com/questions/14874208/how-to-access-and-test-an-internal-non-exports-function-in-a-node-js-module
const rewire = require('rewire')

describe('read the file and extract non exported function', () => {
    it('referenceError for move should come up', () => {
        const submission = rewire('./files/simple.k')
        function move() {
            return true
        }
        const main = submission.__get__('main')
        expect(main()).equal(true)
    })
})