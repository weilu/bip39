/* istanbul ignore file */
import fetch from 'node-fetch'
import { writeFile } from 'fs'
import { join } from 'path'

var log = console.log
var WORDLISTS = [
  'chinese_simplified',
  'chinese_traditional',
  'czech',
  'english',
  'french',
  'italian',
  'japanese',
  'korean',
  'portuguese',
  'spanish'
]

export function update () {
  download().then(function (wordlists) {
    var promises = Object.keys(wordlists).map(function (name) { return save(name, wordlists[name]) })
    return Promise.all(promises)
  })
}

export async function download () {
  var wordlists = {}

  var promises = WORDLISTS.map(async function (name) {
    const content = await fetchRaw(name)
    const wordlist = await toJSON(content)
    wordlists[name] = wordlist
  })

  await Promise.all(promises)
  return wordlists
}

async function fetchRaw (name) {
  var url = 'https://raw.githubusercontent.com/bitcoin/bips/master/bip-0039/' + name + '.txt'
  log('download ' + url)

  const response = await fetch(url)
  return await response.text()
}

function toJSON (content) {
  return content.trim().split('\n').map(function (word) { return word.trim() })
}

function save (name, wordlist) {
  var location = join(__dirname, '..', 'ts_src', 'wordlists', name + '.json')
  var content = JSON.stringify(wordlist, null, 2) + '\n'
  log('save ' + wordlist.length + ' words to ' + location)

  return new Promise(function (resolve, reject) {
    writeFile(location, content, function (err) {
      if (err) reject(err)
      else resolve()
    })
  })
}

