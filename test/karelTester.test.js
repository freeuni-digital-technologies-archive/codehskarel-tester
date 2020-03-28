const { expect } = require('chai')

const tester = require('../src/karelTester')
describe('read file and check if it works correctly', () => {
    it('one test should run and it should pass', async () => {
        const testFile = 'test/files/testCase.js'
        const res = await tester
            .testFile(testFile)
        const passedCount = res.filter(e => e.state == 'passed').length
        expect(passedCount).equal(1)
        expect(res.length).equal(1)
    })
})