# RAS
_A regex & glob based batch renaming utility_

## Installation

`npm -g install ras`
`yarn global add ras`

## Usage

### CLI help

```
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
```

### Arguments

- **pattern**: A regular expression that will match against the file name of any discovered files
- **output**: A [lineup](https://github.com/Commander-lol/lineup) template that will be used to generate the output file name based on the regex match from `pattern`. e.g `myfile-%1%.png` will replace the `%1%` with the first regex capture group

### Options

- **verbose**: Prints out the path of each file that will be moved, and the filename that it will be moved to
- **preview**: As per verbose, but wont actually commit the movements. Good for seeing exactly what will happen. Can safely be specified alongside verbose, they wont clash
- **omit**: Normal execution checks for files in the working directory, this flag stops that. Usually specified alongside a search glob, otherwise nothing will get renamed
- **cwd**: Specify the working directory of the command, relative to the current working directory
- **ext**: _Currently not implemented_ A comma seperated list of file extensions to limit to. Useful to avoid needing to anchor patterns that contain a string that could be mistaken for a file extension
- **find**: A glob expression that will match subfolders of the working directory, which will then be searched for `pattern`. Only exact glob matches will be found, intermediary folders wont be picked up

## Example

This script searches a series of asset folders to rename files containing a dpi identifier to a standardised format to be used as android icons, where the folders are of the format `whitelabel/assets/[company name]/android/icon` and the files have varying names, but all have a `-{size}dpi` identifier in them

```
	ras "-(.*dpi).*?\.png$" \
		"ic_launcher-%1%.png" \
		-o \
		--find="assets/**/android/icon" \
		--cwd="$HOME/projects/MyApp/whitelabel"
```