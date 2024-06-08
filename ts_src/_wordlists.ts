// browserify by default only pulls in files that are hard coded in await imports
// In order of last to first in this file, the default wordlist will be chosen
// based on what is present. (Bundles may remove wordlists they don't need)

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const wordlists: Record<string, string[]> = {};
let _default: string[];

const modulePath = dirname(fileURLToPath(__dirname));
const readWordLists = (wordlist: string): string[] =>
  JSON.parse(
    readFileSync(resolve(modulePath, '..', 'wordlists', wordlist), {
      encoding: 'utf8',
    }),
  );

(async (): Promise<void> => {
  try {
    _default = readWordLists('czech.json');
    wordlists.czech = _default as string[];
  } catch (err) {
    console.log(err);
  }
  try {
    _default = readWordLists('chinese_simplified.json');
    wordlists.chinese_simplified = _default as string[];
  } catch (err) {}
  try {
    _default = readWordLists('chinese_traditional.json');
    wordlists.chinese_traditional = _default as string[];
  } catch (err) {}
  try {
    _default = readWordLists('korean.json');
    wordlists.korean = _default as string[];
  } catch (err) {}
  try {
    _default = readWordLists('french.json');
    wordlists.french = _default as string[];
  } catch (err) {}
  try {
    _default = readWordLists('italian.json');
    wordlists.italian = _default as string[];
  } catch (err) {}
  try {
    _default = readWordLists('spanish.json');
    wordlists.spanish = _default as string[];
  } catch (err) {}
  try {
    _default = readWordLists('japanese.json');
    wordlists.japanese = _default as string[];
    wordlists.JA = _default as string[];
  } catch (err) {}
  try {
    _default = readWordLists('portuguese.json');
    wordlists.portuguese = _default as string[];
  } catch (err) {}
  try {
    _default = readWordLists('english.json');
    wordlists.english = _default as string[];
    wordlists.EN = _default as string[];
  } catch (err) {}
})();

// Last one to overwrite wordlist gets to be default.
export { wordlists, _default };
