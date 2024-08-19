export declare function mnemonicToSeedSync(mnemonic: string, password?: string): Uint8Array;
export declare function mnemonicToSeed(mnemonic: string, password?: string): Promise<Uint8Array>;
export declare function mnemonicToEntropy(mnemonic: string, wordlist?: string[]): string;
export declare function entropyToMnemonic(entropy: Uint8Array | string, wordlist?: string[]): string;
/**
 * Generates a mnemonic phrase based on the provided strength, random number generator, and wordlist.
 * Uses `crypto.getRandomValues` under the hood, which is still an experimental feature as of Node.js 18.19.0. To work around this you can do one of the following:
 * 1. Use a polyfill for crypto.getRandomValues()
 * 2. Use the `--experimental-global-webcrypto` flag when running node.js.
 * 3. Pass in a custom rng function to generate random values.
 * @param {number} [strength=128] - The strength of the mnemonic phrase, must be a multiple of 32.
 * @param {(size: number) => Uint8Array} [rng] - A custom random number generator, defaults to crypto.getRandomValues.
 * @param {string[]} [wordlist] - A custom wordlist, defaults to the standard wordlist.
 * @return {string} The generated mnemonic phrase.
 */
export declare function generateMnemonic(strength?: number, rng?: (size: number) => Uint8Array, wordlist?: string[]): string;
export declare function validateMnemonic(mnemonic: string, wordlist?: string[]): boolean;
export declare function setDefaultWordlist(wordlist: string[]): void;
export declare function getDefaultWordlist(): string[];
export { chineseSimplified, chineseTraditional, english, japanese, korean, spanish, italian, czech, french, portuguese, } from './wordlists/index.js';
//# sourceMappingURL=index.d.ts.map