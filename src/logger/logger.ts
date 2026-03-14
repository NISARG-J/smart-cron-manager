import { LogEntry } from '../smartCron';

export class Logger {
  private logs: LogEntry[] = [];

  log(entry: LogEntry): void {
    this.logs.push(entry);
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }
}