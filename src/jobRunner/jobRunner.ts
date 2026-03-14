import { Job, LogEntry } from '../smartCron';
import { Logger } from '../logger/logger';
import { Notifier } from '../notifier/notifier';
import { RetryManager } from '../retryManager/retryManager';

export class JobRunner {
  constructor(
    private logger: Logger,
    private notifier: Notifier,
    private retryManager: RetryManager
  ) {}

  async run(job: Job): Promise<void> {
    if (job.options.preventOverlap && job.isRunning) {
      return; // skip overlapping
    }

    job.isRunning = true;
    const startTime = new Date();

    try {
      await this.retryManager.runWithRetries(
        job.handler,
        job.options.retries || 0,
        job.options.retryDelay || 0
      );
      const endTime = new Date();
      this.logger.log({
        jobName: job.name,
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
        status: 'success',
      });
    } catch (error) {
      const endTime = new Date();
      this.logger.log({
        jobName: job.name,
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
        status: 'failure',
        errorMessage: (error as Error).message,
      });
      this.notifier.notifyFailure(error as Error, job);
    } finally {
      job.isRunning = false;
      job.lastRun = new Date();
    }
  }
}