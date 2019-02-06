const fs = require('fs')
const flat = require('flat')
const globby = require('globby')
const chalk = require('chalk');

module.exports = find

function find(directory, json, ignoreList) {
    const locales = globby.sync(directory + json)
    const keys = extractKeys(locales)
    const sources = globby.sync([directory + '/**/*.html', directory + '/**/*.ts'])
    const unusedKeys = applyIgnoreFilter(ignoreList, scan(keys, sources))
    failIfNotEmpty(unusedKeys)
}

function failIfNotEmpty(keys) {
    if (keys.length > 0) {
        for (const key of keys) {
            console.error(chalk.red('Unused key: ' + key))
        }
        console.error(chalk.bgRed(keys.length) + chalk.red(' unused keys'))
        process.exit(-1)
    }
}

function applyIgnoreFilter(ignoreList, keys) {
    if (ignoreList) {
        for (const ignoreKey of ignoreList) {
            keys = keys.filter(key => !key.startsWith(ignoreKey.toLowerCase()))
        }
    }
    return keys
}

function scan(keys, files) {
    for (const file of files) {
        const data = fs.readFileSync(file)
        console.log(chalk.blue('Scanning: ') + chalk.green(file))
        const text = data.toString().toLowerCase()
        const keysCopy = [...keys]

        for (const key of keysCopy) {
            if (text.indexOf(key) >= 0) {
                keys.delete(key)
            }
        }
    }
    return [...keys]
}

function extractKeys(files) {
    const keys = new Set()
    files.forEach(file => {
        const flatten = flat(require(file))
        Object.keys(flatten).forEach(key => {
            keys.add(key.toLowerCase())
        })
    })
    return keys
}