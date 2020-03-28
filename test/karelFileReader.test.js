const { expect } = require('chai')
const fileReader = require('../src/karelFileReader')

const TestClass = class {
    constructor() {
        this.i = 0
    }
    move() {
        this.i = this.i + 1
    }
}
describe('read the file and extract non exported function', () => {
    it('add move function', () => {
        const testClass = new TestClass()
        // ./test does not work because rewire is called in another dir
        // absolute path from root is better
        const main = fileReader.getMainFunction('../test/files/simple.k', testClass)
        main()
        expect(testClass.i).equal(2)
    })
})