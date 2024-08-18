export declare function mnemonicToSeedSync(mnemonic: string, password?: string): Uint8Array;
export declare function mnemonicToSeed(mnemonic: string, password?: string): Promise<Uint8Array>;
export declare function mnemonicToEntropy(mnemonic: string, wordlist?: string[]): string;
export declare function entropyToMnemonic(entropy: Uint8Array | string, wordlist?: string[]): string;
export declare function generateMnemonic(strength?: number, rng?: (size: number) => Uint8Array, wordlist?: string[]): string;
export declare function validateMnemonic(mnemonic: string, wordlist?: string[]): boolean;
export declare function setDefaultWordlist(wordlist: string[]): void;
export declare function getDefaultWordlist(): string[];
export { chineseSimplified, chineseTraditional, english, japanese, korean, spanish, italian, czech, french, portuguese, } from './wordlists/index.js';
//# sourceMappingURL=index.d.ts.map