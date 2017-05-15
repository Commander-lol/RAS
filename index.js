#! /usr/bin/env node

const fs = require('fs-jetpack')
const neodoc = require('neodoc')
const { version } = require('./package.json')
const pathUtil = require('path')
const lineup = require('lineup-template')

const doc = `
Usage: ras <pattern> <output> [options]

Options:
	-h, --help        Print out this text
	--version         Print out the ras version
	-v, --verbose     Print out info about what's happening
	-p, --preview     Log out the changes that would happen but don't execute them
	-o, --omit        Omit files from the cwd that aren't in a glob matched directory
	--cwd=<root>      The directory to run in, if not the current one
	--ext=<extension> A comma seperated list of extensions to filter by
	--find=<glob>     Specify the glob path that will match folders to search in
`

const params = neodoc.run(doc, { version })
const arg = name => params[`<${name}>`]
const opt = name => params[`--${name}`]
const flag = name => !!params[`--${name}`]

const pattern = new RegExp(arg('pattern'))
const output = arg('output')

const findGlob = opt('find')
const extList = opt('ext')
const newCwd = opt('cwd')

const verbose = flag('verbose')
const preview  = flag('preview')
const omit = flag('omit')

const extensions = extList ?
	extList.split(',').map(e => e.trim()).filter(e => !!e)
	: []

const filterExtensions = extensions.length !== 0

let dir = newCwd ? fs.cwd(newCwd) : fs

const additionals = findGlob ?
	dir.find('.', { 
		matching: findGlob,
		files: false,
		directories: true,
		recursive: true,
	})
	: []

let files = omit ? [] : dir.list().map(f => dir.path(f))

files = files.concat(
	...additionals.map(
		path => dir.list(path).map(f => dir.path(path, f))
	)
)

files.forEach(file => {
	const result = pattern.exec(pathUtil.basename(file))
	if (!!result) {
		const props = {}
		result.forEach((r, i) => props[i] = r)
		const newPath = lineup(output, result)
		if (preview || verbose) {
			console.log('Moving', file, 'to', newPath)
		}
		if (!preview) {
			fs.move(file, pathUtil.join(pathUtil.dirname(file), newPath))
		}
	}
})