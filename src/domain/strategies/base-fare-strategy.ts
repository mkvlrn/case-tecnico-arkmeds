export abstract class BaseFareStrategy {
  protected readonly days: number[];
  protected readonly fromHour: number;
  protected readonly toHour: number;

  abstract readonly price: number;

  protected constructor(days: number[], fromHour: number, toHour: number) {
    this.days = days;
    this.fromHour = fromHour;
    this.toHour = toHour;
  }

  matches(datetime: Date): boolean {
    const day = datetime.getDay();
    const hour = datetime.getHours();

    if (!this.days.includes(day)) {
      return false;
    }

    if (this.fromHour < this.toHour) {
      // regular intervals (ex: 08:00–17:00)
      return hour >= this.fromHour && hour < this.toHour;
    }
    // intervals spanning midnight (ex: 20:00–08:00)
    return hour >= this.fromHour || hour < this.toHour;
  }
}
