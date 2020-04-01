// https://stackoverflow.com/questions/14874208/how-to-access-and-test-an-internal-non-exports-function-in-a-node-js-module
const rewire = require('rewire')
const { Karel, World, C } = require('./Karel')
const fs = require('fs')

const customStuctures = [
    {
        regex: /repeat\s*\((\s*[\d|\w]+\s*)\)/g,
        replace: (match) => `for (let i=0; i < ${match[1]}; i++)`
    },
    {
        regex: /return\(\)/g,
        replace: match => `repeatFunction()`
    }
]
function replaceCustomStructures(fileName) {
    let contents = fs.readFileSync(fileName, 'utf8')
    const newFile = fileName + '.fixed'
    const replaced = customStuctures.map(structure => {
        const regex = structure.regex
        if (contents.match(regex) == null)
            return false
        const matches = [...contents.matchAll(regex)]
        matches.forEach(match => {
            const replacement = structure.replace(match)
            contents = contents.replace(match[0], replacement)
        })
        return true
    })
    if (!replaced.filter(e => e).length)
        return fileName
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
    submission.__set__('beepersPresent', () => karel.beepersPresent())
    submission.__set__('noBeepersPresent', () => karel.noBeepersPresent())
    submission.__set__('frontIsBlocked', () => karel.frontIsBlocked())
    submission.__set__('leftIsClear', () => karel.leftIsClear())
    return {
        main: main,
        karel: karel,
        world: world
    }
} 