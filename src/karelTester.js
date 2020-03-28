const fileReader = require('./karelFileReader')
const { Karel, World, C } = require('./Karel')
module.exports.testFile = function (fileName, world) {
    const karel = new Karel(world)
    const main = fileReader.getMainFunction(fileName, karel)
    main()
}