import chalk from "chalk"
import fs from "fs"

const JSON_ONE_PATH = process.argv[2]
const JSON_TWO_PATH = process.argv[3]
let fileJSONOne
let fileJSONTwo
let JSONOne
let JSONTwo
let JSONOneLeaves = []
let JSONTwoLeavesNotExist = []

function managmentError(opts) {
  typeof e === 'string' || typeof e === 'undefined' ? (console.error(chalk.red(opts.e))) : (console.error(chalk.red(JSON.stringify(opts.e, null, 2))))
  opts.message && (console.error(chalk.red(opts.message)))
  !opts.notProccessExit && (process.exit(0))
}

function readFiles() {
  try {
    fileJSONOne = fs.readFileSync(JSON_ONE_PATH, 'utf-8')
    fileJSONTwo = fs.readFileSync(JSON_TWO_PATH, 'utf-8')
  } catch (e) {
    managmentError({
      e,
      message: 'Error: Cannot read JSON files'
    })
    process.exit(0)
  }
}

function parseFiles2Object() {
  try {
    JSONOne = JSON.parse(fileJSONOne)
    JSONTwo = JSON.parse(fileJSONTwo)
  } catch (e) {
    managmentError({
      e,
      message: 'Error: Cannot parse file to JSON Object'
    })
  }
}

function getLeafPaths(obj, currentPath = [], result = []) {
  for (const [key, value] of Object.entries(obj)) {
    const newPath = [...currentPath, key];

    if (typeof value === 'object' && value !== null) {
      getLeafPaths(value, newPath, result);
    } else {
      result.push(newPath);
    }
  }

  return result;
}

function compareJSONLeaves() {
  JSONOneLeaves.forEach(leavesKeys => {
    let alreadyExist = true
    let lastObjectPath = JSONTwo

    for (const key of leavesKeys) {
      lastObjectPath[key] ?? (alreadyExist = false)
      if (!alreadyExist) break
      lastObjectPath = lastObjectPath[key]
    }

    !alreadyExist && (JSONTwoLeavesNotExist.push(leavesKeys))
  })
}

function writeConsoleResult() {
  for (const leaf of JSONTwoLeavesNotExist) {
    let message = ''
    let firstKey = true

    for (const key of leaf) {
      !firstKey && (message += '.')
      message += `${key}`
      firstKey = false
    }

    console.log(chalk.green(message))
  }

}

function init() {
  if (!JSON_ONE_PATH || !JSON_TWO_PATH) {
    console.error(chalk.red('Error: The two params of json´s path are undefined.'))
    process.exit(0)
  }
  readFiles()
  parseFiles2Object()
  JSONOneLeaves = getLeafPaths(JSONOne)
  compareJSONLeaves()
  writeConsoleResult()
}


init()