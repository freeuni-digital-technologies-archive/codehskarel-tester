
const tester = require('../src/karelTester')
const testFile = 'test/files/testCase.js'
tester
    .testFile(testFile)
    .then(res => {
        const passedCount = res.filter(e => e.state == 'passed').length
        console.log(passedCount)
        console.log(res.length)
        console.log(res)
    })
