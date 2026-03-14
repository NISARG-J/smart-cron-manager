import * as cron from 'node-cron';
import { Job } from '../smartCron';
import { JobRunner } from '../jobRunner/jobRunner';

export class Scheduler {
  constructor(private jobRunner: JobRunner) {}

  scheduleJob(job: Job): void {
    const scheduledJob = cron.schedule(job.cronExpression, () => {
      this.jobRunner.run(job);
    });
    job.scheduledJob = scheduledJob;
  }

  startJob(job: Job): void {
    if (job.scheduledJob) {
      job.scheduledJob.start();
    }
  }

  stopJob(job: Job): void {
    if (job.scheduledJob) {
      job.scheduledJob.stop();
    }
  }

  destroyJob(job: Job): void {
    if (job.scheduledJob) {
      job.scheduledJob.stop();
    }
  }
}