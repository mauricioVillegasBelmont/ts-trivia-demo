import Api from "./trivia/Api";
import Trivia, { UserAns } from "./trivia/trivia";


const triviaElement: HTMLFormElement | null = document.querySelector("#trivia");
const token = triviaElement?.dataset.token;
if (!triviaElement || !token) throw new Error("HTTP error triviaElement");

const savePath =  triviaElement.getAttribute("action") ?? "/save_trivia";
const saveMethod =  triviaElement.getAttribute("method") ?? "POST";


var gameover:boolean = false;
window.addEventListener("beforeunload", (e) => {
  if (!gameover) {
    e.preventDefault();
    return "¿Seguro que quieres irte?";
  }
});
Api.getTrivia(token)
  .then((data) => {
    return new Promise<UserAns[]>((resolve) => {
      const callback = (userAns: UserAns[]) => resolve(userAns);
      const trivia = new Trivia(data, callback);
      trivia.init();
    });
  })
  .then((userAns) => {
    return Api.saveTrivia(userAns, token, savePath, saveMethod);
  })
  .then((response) => {
    gameover = true;
    if (response.status == "ok") {
      return (window.location.href = response.redirect);
    }
    window.alert(
      "Hubo un problema. Por favor, pongase en contacto con el administrador."
    );
    return (window.location.href = "/");
  })
  .catch((err) => {
    console.error(err);
    alert(
      "Algo salio mal. Porfavor, pongase en contacto con el administrador."
    );
  });
