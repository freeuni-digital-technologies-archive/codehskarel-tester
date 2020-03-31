// https://stackoverflow.com/questions/14874208/how-to-access-and-test-an-internal-non-exports-function-in-a-node-js-module
const rewire = require('rewire')
const { Karel, World, C } = require('./Karel')
const fs = require('fs')
function replaceCustomStructures(fileName) {
    let contents = fs.readFileSync(fileName, 'utf8')
    const regex = /repeat\s*\((\s*[\d|\w]+\s*)\)/g
    if (contents.match(regex) == null)
        return fileName
    const newFile = fileName + '.fixed'
    const matches = [...contents.matchAll(regex)]
    matches.forEach(match => {
        const replacement = `for (let i=0; i < ${match[1]}; i++)`
        contents = contents.replace(match[0], replacement)
    })
    fs.writeFileSync(newFile, contents)
    return newFile
}
module.exports.setUpSubmission = (fileName, config = {}) => {
    const newFile = replaceCustomStructures(fileName)
    const submission = rewire(newFile)
    const world = new World(config.world || {}) 
    const karelConfig = config.karel || {}
    karelConfig.world = world
    const karel = new Karel(karelConfig)
    const main = submission.__get__('main')
    submission.__set__('move', () => karel.move())
    submission.__set__('turnLeft', () => karel.turnLeft())
    submission.__set__('pickBeeper', () => karel.pickBeeper())
    submission.__set__('putBeeper', () => karel.putBeeper())
    submission.__set__('frontIsClear', () => karel.frontIsClear())
    return {
        main: main,
        karel: karel,
        world: world
    }
} 