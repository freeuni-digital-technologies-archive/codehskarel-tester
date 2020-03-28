// https://stackoverflow.com/questions/14874208/how-to-access-and-test-an-internal-non-exports-function-in-a-node-js-module
const rewire = require('rewire')

module.exports.getMainFunction = (fileName, object) => {
    const submission = rewire(fileName)
    const main = submission.__get__('main')
    submission.__set__('move', () => object.move())
    submission.__set__('turnLeft', () => object.turnLeft())
    submission.__set__('pickBeeper', () => object.pickBeeper())
    submission.__set__('putBeeper', () => object.putBeeper())
    return main
} 