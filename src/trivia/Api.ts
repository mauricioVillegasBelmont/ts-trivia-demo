import PECrypto from "./pecrypto";
import { ConfigTrivia, UserAns } from "./trivia";

interface TriviaSaveResponseJSONObj {
  status: string;
  redirect: string;
}
export default class Api {
  static async getTrivia(token: string, path: URL | string = "/get_trivia") {
    return new Promise<ConfigTrivia>((resolve, reject) => {
      fetch(path)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const triviaData: ConfigTrivia = PECrypto.decrypt(data, token);
          resolve(triviaData);
        });
    });
  }
  static async saveTrivia(
    _data: UserAns[],
    token: string,
    path: URL | string = "/save_trivia",
    method: string = "POST"
  ) {
    return new Promise<TriviaSaveResponseJSONObj>((resolve, reject) => {
      const data = PECrypto.encrypt({ trivia: _data }, token);
      const formData = new FormData();
      formData.append("s", data);
      fetch(path, {
        method: method.toUpperCase(),
        headers: {
          "Cache-Control": "no-cache",
        },
        body: formData,
      })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          resolve(response);
        });
    });
  }
}
