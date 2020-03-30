const fileReader = require('./karelFileReader')

function getFileReaderError(err) {
    const result = {
        error: true,
        message: "there is a problem with the file",
    }
    const errLine = err.stack.split('\n')[0]
    const lineNumber = errLine.split(':')[1]
    if (err.name == "SyntaxError") {
        result.details = `error reading the file on line ${lineNumber}`
    } else {
        result.details = `Unknown error occured: ${errLine}, ${err.message}`
    }
    return result
}

module.exports.KarelTester = class {
    constructor(testFile) {
        const { config, assertions } = require(testFile)
        this.config = config
        this.assertions = assertions
    }

    testSubmission(submissionFile) {
        const results = []
        try {
            const { main, karel, world } = fileReader.setUpSubmission(submissionFile, this.config)
            try {
                main()
                this.assertions.map(assertion => {
                    try {
                        const res = assertion(karel).__flags
                        const result = {
                            passed: true,
                            message: res.message
                        }
                        results.push(result)
                    } catch (err) {
                        const result = {
                            passed: false,
                            message: err.message
                        }
                        results.push(result)
                    } 
                })
            } catch (err) {
                const result = {
                    error: true,
                    message: "there is a bug in the program",
                    details: `${err}, ${karel}`,
                }
                results.push(result)
            }
        } catch (err) {
            results.push(getFileReaderError(err))
        }
        return results
    }
}