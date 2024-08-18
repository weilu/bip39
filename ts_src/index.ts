import { sha256 } from '@noble/hashes/sha256';
import { sha512 } from '@noble/hashes/sha512';
import { pbkdf2, pbkdf2Async } from '@noble/hashes/pbkdf2';
import * as tools from 'uint8array-tools';

let DEFAULT_WORDLIST: string[] | undefined;

const INVALID_MNEMONIC = 'Invalid mnemonic';
const INVALID_ENTROPY = 'Invalid entropy';
const INVALID_CHECKSUM = 'Invalid mnemonic checksum';
const WORDLIST_REQUIRED =
  'A wordlist is required but a default could not be found.\n' +
  'Please pass a 2048 word array explicitly.';

function normalize(str?: string): string {
  return (str || '').normalize('NFKD');
}

function lpad(str: string, padString: string, length: number): string {
  while (str.length < length) {
    str = padString + str;
  }
  return str;
}

function binaryToByte(bin: string): number {
  return parseInt(bin, 2);
}

function bytesToBinary(bytes: number[]): string {
  return bytes.map((x: number): string => lpad(x.toString(2), '0', 8)).join('');
}

function deriveChecksumBits(entropyBuffer: Uint8Array): string {
  const ENT = entropyBuffer.length * 8;
  const CS = ENT / 32;
  const hash = sha256(entropyBuffer);
  return bytesToBinary(Array.from(hash)).slice(0, CS);
}

function salt(password?: string): string {
  return 'mnemonic' + (password || '');
}

export function mnemonicToSeedSync(
  mnemonic: string,
  password?: string,
): Uint8Array {
  const mnemonicBuffer = tools.fromUtf8(normalize(mnemonic));
  const saltBuffer = tools.fromUtf8(salt(normalize(password)));
  const res = pbkdf2(sha512, mnemonicBuffer, saltBuffer, {
    c: 2048,
    dkLen: 64,
  });
  return res;
}

export function mnemonicToSeed(
  mnemonic: string,
  password?: string,
): Promise<Uint8Array> {
  const mnemonicBuffer = tools.fromUtf8(normalize(mnemonic));
  const saltBuffer = tools.fromUtf8(salt(normalize(password)));
  return pbkdf2Async(sha512, mnemonicBuffer, saltBuffer, {
    c: 2048,
    dkLen: 64,
  });
}

export function mnemonicToEntropy(
  mnemonic: string,
  wordlist?: string[],
): string {
  wordlist = wordlist || DEFAULT_WORDLIST;
  if (!wordlist) {
    throw new Error(WORDLIST_REQUIRED);
  }

  const words = normalize(mnemonic).split(' ');
  if (words.length % 3 !== 0) {
    throw new Error(INVALID_MNEMONIC);
  }

  // convert word indices to 11 bit binary strings
  const bits = words
    .map(
      (word: string): string => {
        const index = wordlist!.indexOf(word);
        if (index === -1) {
          throw new Error(INVALID_MNEMONIC);
        }

        return lpad(index.toString(2), '0', 11);
      },
    )
    .join('');

  // split the binary string into ENT/CS
  const dividerIndex = Math.floor(bits.length / 33) * 32;
  const entropyBits = bits.slice(0, dividerIndex);
  const checksumBits = bits.slice(dividerIndex);

  // calculate the checksum and compare
  const entropyBytes = entropyBits.match(/(.{1,8})/g)!.map(binaryToByte);
  if (entropyBytes.length < 16) {
    throw new Error(INVALID_ENTROPY);
  }
  if (entropyBytes.length > 32) {
    throw new Error(INVALID_ENTROPY);
  }
  if (entropyBytes.length % 4 !== 0) {
    throw new Error(INVALID_ENTROPY);
  }

  const entropy = Uint8Array.from(entropyBytes);
  const newChecksum = deriveChecksumBits(entropy);
  if (newChecksum !== checksumBits) {
    throw new Error(INVALID_CHECKSUM);
  }

  return tools.toHex(entropy);
}

export function entropyToMnemonic(
  entropy: Uint8Array | string,
  wordlist?: string[],
): string {
  if (typeof entropy === 'string') {
    entropy = tools.fromHex(entropy);
  }
  wordlist = wordlist || DEFAULT_WORDLIST;
  if (!wordlist) {
    throw new Error(WORDLIST_REQUIRED);
  }

  // 128 <= ENT <= 256
  if (entropy.length < 16) {
    throw new TypeError(INVALID_ENTROPY);
  }
  if (entropy.length > 32) {
    throw new TypeError(INVALID_ENTROPY);
  }
  if (entropy.length % 4 !== 0) {
    throw new TypeError(INVALID_ENTROPY);
  }

  const entropyBits = bytesToBinary(Array.from(entropy));
  const checksumBits = deriveChecksumBits(entropy);

  const bits = entropyBits + checksumBits;
  const chunks = bits.match(/(.{1,11})/g)!;
  const words = chunks.map(
    (binary: string): string => {
      const index = binaryToByte(binary);
      return wordlist![index];
    },
  );

  return wordlist[0] === '\u3042\u3044\u3053\u304f\u3057\u3093' // Japanese wordlist
    ? words.join('\u3000')
    : words.join(' ');
}

export function generateMnemonic(
  strength?: number,
  rng?: (size: number) => Uint8Array,
  wordlist?: string[],
): string {
  strength = strength || 128;
  if (strength % 32 !== 0) {
    throw new TypeError(INVALID_ENTROPY);
  }
  rng = rng || ((size: number): Uint8Array => crypto.getRandomValues(new Uint8Array(size)));    
  return entropyToMnemonic(rng(strength / 8), wordlist);
}

export function validateMnemonic(
  mnemonic: string,
  wordlist?: string[],
): boolean {
  try {
    mnemonicToEntropy(mnemonic, wordlist);
  } catch (e) {
    return false;
  }

  return true;
}

function validateWordlist(wordlist: string[]): boolean {
  if (!Array.isArray(wordlist)) {
    return false;
  }
  
  if (wordlist.length !== 2048) {
    return false;
  }
  
  const unique = new Set(wordlist);
  if (unique.size !== wordlist.length) {
    return false;
  }
  
  return true;
}

export function setDefaultWordlist(wordlist: string[]): void {
  if (!validateWordlist(wordlist)) {
    throw new Error('Invalid wordlist');
  }
  DEFAULT_WORDLIST = wordlist;
}

export function getDefaultWordlist(): string[] {
  if (!DEFAULT_WORDLIST) {
    throw new Error('No Default Wordlist set');
  }

  return DEFAULT_WORDLIST;
}

export {
  chineseSimplified,
  chineseTraditional,
  english,
  japanese,
  korean,
  spanish,
  italian,
  czech,
  french,
  portuguese,
} from './wordlists/index.js';
