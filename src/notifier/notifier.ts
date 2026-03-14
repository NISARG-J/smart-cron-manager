import { Job } from '../smartCron';

export class Notifier {
  notifyFailure(error: Error, job: Job): void {
    if (job.options.onFailure) {
      job.options.onFailure(error, job);
    }
  }
}