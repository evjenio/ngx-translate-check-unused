#!/usr/bin/env node

const find = require('.')
const path = require('path')

var argv = require('minimist')(process.argv.slice(2));
console.dir(argv);
if (!argv.s || !argv.j) {
    usage()
}
const src = argv.s.trim()
const json = argv.j.trim()
const ignoreList = argv.ignore ? argv.ignore.split(',') : []
const dir = path.isAbsolute(src) ? path.resolve(src) : path.resolve(process.cwd(), src)

find(dir, json, ignoreList)

function usage() {
    console.log(`
    Usage:
    ngx-translate-check-unused 
    -s D:/Projects/rollout/Rollout/Source/Rollout.UI/src
    -j /assets/i18n/*.json
    --ignore=servererror,toast
    `)

    process.exit()
}
