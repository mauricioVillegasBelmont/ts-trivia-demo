export interface CipherParams {
  ciphertext: CryptoJS.lib.WordArray;
  iv?: CryptoJS.lib.WordArray;
  key?: CryptoJS.lib.WordArray;
  salt?: CryptoJS.lib.WordArray;
}
declare module "pecrypto" {
  class PECrypto {
    encrypt: (value: object, password: string) => string;
    decrypt: (jsonStr: string, password: string) => any;
    stringify: (cipherParams: CipherParams) => string;
    parse: (jsonStr: string) => CipherParams;
  }
  export = PECrypto;
}
