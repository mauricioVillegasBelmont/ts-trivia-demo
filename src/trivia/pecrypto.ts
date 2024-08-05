/**
 * PymEngine formatter for CryptoJS
 * @link https://pymeweb.mx
 * @version 1.0.0
 */

// import "./pecrypto.d";
// declare module "pecrypto"
import CryptoJS from "crypto-js";


// import { CipherParams } from "crypto-js";
export interface CipherParams {
  ciphertext: CryptoJS.lib.WordArray;
  iv?: CryptoJS.lib.WordArray;
  key?: CryptoJS.lib.WordArray;
  salt?: CryptoJS.lib.WordArray;
  blockSize?: number;
}
interface CipherParamsHelper {
  ct: string;
  iv?: string;
  s?: string;
}

const PECrypto = {
  // construct() {}
  /**
   * Encrypt any value
   * @param {*} value
   * @param {string} password
   * @return {string}
   */
  encrypt: function (value: object, password: string): string {
    // const options =
    return CryptoJS.AES.encrypt(JSON.stringify(value), password, {
      format: PECrypto,
    }).toString();
  },
  /**
   * Decrypt a previously encrypted value
   * @param {string} jsonStr
   * @param {string} password
   * @return {*}
   */
  decrypt: function (jsonStr: string, password: string) {
    return JSON.parse(
      CryptoJS.AES.decrypt(jsonStr, password, { format: PECrypto }).toString(
        CryptoJS.enc.Utf8
      )
    );
  },
  /**
   * Stringify cryptojs data
   * @param {Object} cipherParams
   * @return {string}
   */
  stringify: function (cipherParams: CipherParams): string {
     var j: CipherParamsHelper = {
       ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64),
     };
     if (cipherParams.iv) j.iv = cipherParams.iv.toString();
     if (cipherParams.salt) j.s = cipherParams.salt.toString();
     return JSON.stringify(j).replace(/\s/g, "");
  },
  /**
   * Parse cryptojs data
   * @param {string} jsonStr
   * @return {*}
   */
  parse: function (jsonStr: string): CipherParams {
    var j = JSON.parse(jsonStr);
    var cipherParams: CipherParams = {
      ciphertext: CryptoJS.enc.Base64.parse(j.ct),
    };
    if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
    if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
    return cipherParams;
  },
};
export default PECrypto