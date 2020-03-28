const { expect } = require('chai')
// https://stackoverflow.com/questions/14874208/how-to-access-and-test-an-internal-non-exports-function-in-a-node-js-module
const rewire = require('rewire')

describe('read the file and extract non exported function', () => {
    it('console log should be called twice', () => {
        const submission = rewire('./files/simple.k')
        const main = submission.__get__('main')
        function move() {
            console.log('a')
        }
        submission.__set__('move', move)
    })
})