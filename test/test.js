const { expect } = require('chai')
// https://stackoverflow.com/questions/14874208/how-to-access-and-test-an-internal-non-exports-function-in-a-node-js-module
const rewire = require('rewire')

const TestClass = class {
    constructor() {
        this.i = 0
        console.log(this)
    }
    move() {
        this.i = this.i + 1
    }
}
describe('read the file and extract non exported function', () => {
    it('console log should be called twice', () => {
        const submission = rewire('./files/simple.k')
        const main = submission.__get__('main')
        const testClass = new TestClass()
        submission.__set__('move', () => testClass.move())
        main()
        expect(testClass.i).equal(2)
    })
})