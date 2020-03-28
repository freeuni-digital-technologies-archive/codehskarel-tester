const { expect } = require('chai')
const rewire = require('rewire')

describe('read the file and extract non exported function', () => {
    it('referenceError for move should come up', () => {
        const submission = rewire('./files/simple.k')
        const main = submission.__get__('main')
        main()
    })
})