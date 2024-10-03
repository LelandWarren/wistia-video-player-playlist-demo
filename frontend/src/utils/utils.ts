export class Utils {
  static formatTime(total: number): string {
    let minutes = 0;
    let seconds = 0;

    if (total > 0) {
      minutes += Math.floor(total / 60);
      total %= 60;
    }

    seconds = Math.round(total);

    if (seconds === 60) {
      minutes += 1;
      seconds = 0;
    }

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }
}
