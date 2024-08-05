import { Moment } from "moment";
import moment from "moment";

export interface TimerValues {
  _time:number;
  ms:number;
  timeSecs:number;
  secs:number;
  timeMinutes:number;
  mins:number;
  hours:number;
  finalTime:string;
}

export default class Timer {
  moment?: Moment;
  crono?: ReturnType<typeof setInterval>;
  intervaloMs = 10;
  pauseStorage: Moment | undefined;
  values?: TimerValues;
  callback: Function;
  constructor(callback: Function) {
    this.callback = callback;
  }

  start() {
    this.moment = moment();
    this.crono = setInterval(() => this.workflow(), this.intervaloMs);
  }

  pause() {
    this.pauseStorage = moment();
    window.clearInterval(this.crono);
  }
  resume() {
    const resume = moment();
    const crono = resume.diff(this.pauseStorage, "ms");
    this.moment?.add(crono, "ms");
    this.crono = setInterval(() => {
      this.workflow();
    }, this.intervaloMs);
  }
  end() {
    window.clearInterval(this.crono);
  }
  addZ(num: number, padding: number = 2) {
    return String(num).padStart(padding, "0");
  }
  cronoTimer() {
    const actual = moment();
    const time = actual.diff(this.moment, "ms");

    const ms = time % 1000; // Obtener milisegundos restantes
    const timeSecs = Math.floor(time / 1000); // Total de segundos
    const secs = timeSecs % 60; // Obtener segundos restantes
    const timeMinutes = Math.floor(timeSecs / 60); // Total de minutos
    const mins = timeMinutes % 60; // Obtener minutos restantes
    const hours = Math.floor(timeMinutes / 60); // Total de horas
    const finalTime = `${this.addZ(hours)}:${this.addZ(mins)}:${this.addZ(
      secs
    )}:${this.addZ(ms, 3)}`;

    this.values = {
      _time: time,
      ms: ms,
      timeSecs: timeSecs,
      secs: secs,
      timeMinutes: timeMinutes,
      mins: mins,
      hours: hours,
      finalTime: finalTime,
    };
  }
  workflow() {
    this.cronoTimer();
    this.callback(this.values);
  }
}
