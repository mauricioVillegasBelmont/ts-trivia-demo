import { TimerValues } from "./timer";

export default class Clock {
  clockElement: HTMLElement | null = document.querySelector("#timekeeper");
  clockTimerElement: HTMLElement | null = document.getElementById("timer");
  constructor() {}
  start() {
    if (!this.clockElement) return;
    this.clockElement.classList.remove("end");
    this.clockElement.classList.add("start");
  }
  end() {
    if (!this.clockElement) return;
    this.clockElement.classList.remove("start");
    this.clockElement.classList.add("end");
  }
  addZ(num: number, padding: number = 2) {
    return String(num).padStart(padding, "0");
  }
  update(value: TimerValues) {
    if (!this.clockTimerElement) return;
    this.clockTimerElement.innerHTML = `${this.addZ(value.mins)}:${this.addZ(
      value.secs
    )}:${this.addZ(value.ms, 3).substring(0, 2)}`;
  }
}