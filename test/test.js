const { expect } = require('chai')
const rewire = require('rewire')

describe('', () => {
    it('', () => {
        const submission = rewire('./files/simple.k')
        const main = submission.__get__('main')
        main()
    })
})