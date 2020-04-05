// https://stackoverflow.com/questions/14874208/how-to-access-and-test-an-internal-non-exports-function-in-a-node-js-module
import rewire from 'rewire'
import { Karel } from 'jskarel'
import fs from 'fs'
import { Config } from './karelTester'

const customStuctures = [
    {
        regex: /repeat\s*\((\s*[\d|\w]+\s*)\)/g,
        replace: (match: RegExpMatchArray) => `for (let i=0; i < ${match[1]}; i++)`
    },
    {
        regex: /return\(\)/g,
        replace: (match: RegExpMatchArray) => `repeatFunction()`
    }
]
function replaceCustomStructures(fileName: string) {
    let contents = fs.readFileSync(fileName, 'utf8')
    const newFile = fileName + '.fixed'
    const replaced = customStuctures.map(structure => {
        const regex = structure.regex
        if (contents.match(regex) == null)
            return false
        const matches = [...contents['matchAll'](regex)]
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
export function setUpSubmission(fileName: string, config: Config = {}) {
    const newFile = replaceCustomStructures(fileName)
    const submission = rewire(newFile)
    const world = config.world || {}
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