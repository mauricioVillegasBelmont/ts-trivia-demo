import Ractive from "ractive";
import Timer, { TimerValues } from "./timer";
import Clock from "./clock";

export type BasicObject = {
  [id: string]: string | number | boolean | object;
};
export interface DataObject{
   name: string;
   value: FormDataEntryValue;
 }
export type TriviaOption = {
  TRV_OPC: string;
  TRV_OPC_VAL: string;
  ID?: string;
};
export interface TriviaObject {
  TRIVIA_ID: number;
  TRIVIA_PREGUNTA: string;
  options: TriviaOption[];
}
export interface InitConfigTrivia {
  countdown?: boolean;
}
export interface ConfigTrivia {
  config: InitConfigTrivia;
  trivia: TriviaObject[];
}

export interface UserAns {
  trivia_id: number;
  ans: string;
  tiempo: number;
  timer: string;
}

export default class Trivia {
  #timer = new Timer(this.updateTime.bind(this));
  #data: UserAns[] = [];
  #trivia?: TriviaObject[];
  clock = new Clock();
  config: InitConfigTrivia = {};
  triviaElement: HTMLElement | null = document.querySelector("#trivia");
  hiddenInputs = new Ractive({
    target: "#hidden__inputs",
    template: "#hidden__inputs--template",
    data: { TIME_MS: "0", TIMER_CLOCK: "00:00:00" },
  });
  triviaQuestion = new Ractive({
    target: "#trivia__question",
    template: "#trivia__question--template",
  });
  triviaAnswers = new Ractive({
    target: "#trivia__options",
    template: "#trivia__options--template",
    on: {
      handleInputChange: function () {
        const submitButtons: NodeListOf<HTMLButtonElement> =
          document.querySelectorAll('[type="submit"]');
        submitButtons.forEach((button) => {
          button.classList.remove("disabled");
          button.disabled = false;
        });
      },
    },
  });
  #resolver?;
  constructor(config: ConfigTrivia, callback:(userAns: UserAns[]) => void) {
    this.#resolver = callback;
    this.config = config.config;
    this.#trivia = config.trivia;
    this.initSubmitHandler();
    this.disableSubmit();
  }
  init() {
    this.#timer.start();
    this.clock.start();
    this.renderTrivia();
  }

  updateTime(time: TimerValues) {
    this.clock.update(time);
    this.hiddenInputs.set("TIME_MS", time._time);
    this.hiddenInputs.set("TIMER_CLOCK", time.finalTime);
  }

  get loader() {
    const loader: HTMLDialogElement | null =
      document.querySelector("dialog#loader");
    if (!loader) return false;
    return loader;
  }

  initSubmitHandler() {
    this.triviaElement?.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!(e.currentTarget instanceof HTMLFormElement)) return;
      const formData = new FormData(e.currentTarget);
      const data = Array.from(formData.entries()).map(([name, value]) => ({
        name,
        value,
      }));
      this.setData(data);
      this.#logic();
    });
  }

  setData(data: DataObject[]) {
    const _data: { [x: string]: string } = {};
    for (const item of data) {
      var name = item["name"];
      var value = item["value"];
      _data[name] = value.toString();
    }
    const userAns: UserAns = {
      trivia_id: Number.parseInt(_data["trivia_id"]) as number,
      ans: _data["ans"] as string,
      tiempo: Number.parseInt(_data["tiempo"]) as number,
      timer: _data["timer"] as string,
    };

    this.#data.push(userAns);
    this.#trivia?.shift();
  }

  #logic() {
    this.clearTrivia();
    this.disableSubmit();
    if (this.#trivia !== undefined && this.#trivia.length) {
      return this.renderTrivia();
    }
    this.#finish();
  }

  disableSubmit() {
    const submitButtons: NodeListOf<HTMLButtonElement> =
      document.querySelectorAll('[type="submit"]');
    submitButtons.forEach((button) => {
      button.classList.add("disabled");
      button.disabled = true;
    });
  }

  clearTrivia() {
    this.triviaAnswers.set("DISPLAY", "none");
    this.triviaAnswers.set("OPTIONS", []);
    this.disableSubmit();
  }

  renderTrivia() {
    if (this.#trivia === undefined) return this.#finish();
    const question = this.#trivia[0];
    question["options"].forEach((option, index) => {
      option.ID = `opc_${new Date().getTime().toString(36)}-${index}`;
    });
    this.triviaQuestion.set("TRIVIA_ID", question.TRIVIA_ID);
    this.triviaQuestion.set("TRIVIA_PREGUNTA", question.TRIVIA_PREGUNTA);
    this.triviaAnswers.set("DISPLAY", "block");
    this.triviaAnswers.set("OPTIONS", question.options);
  }

  #finish() {
    if (this.loader) this.loader.showModal();
    this.#timer.end();
    this.clock.end();

    const ans = this.#data;
    if (this.#resolver !== undefined) this.#resolver(ans);
  }
}
