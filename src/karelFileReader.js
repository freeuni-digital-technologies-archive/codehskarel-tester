// https://stackoverflow.com/questions/14874208/how-to-access-and-test-an-internal-non-exports-function-in-a-node-js-module
const rewire = require('rewire')
const { Karel, World, C } = require('./Karel')

module.exports.setUpSubmission = (fileName, config) => {
    const submission = rewire(fileName)
    const world = new World(config.world || {}) 
    const karelConfig = config.karel || {}
    karelConfig.world = world
    const karel = new Karel(karelConfig)
    const main = submission.__get__('main')
    submission.__set__('move', () => karel.move())
    submission.__set__('turnLeft', () => karel.turnLeft())
    submission.__set__('pickBeeper', () => karel.pickBeeper())
    submission.__set__('putBeeper', () => karel.putBeeper())
    return {
        main: main,
        karel: karel,
        world: world
    }
} 