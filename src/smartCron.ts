import * as cron from 'node-cron';
import { JobRegistry } from './jobRegistry/jobRegistry';
import { JobRunner } from './jobRunner/jobRunner';
import { RetryManager } from './retryManager/retryManager';
import { Logger } from './logger/logger';
import { Notifier } from './notifier/notifier';
import { Scheduler } from './scheduler/scheduler';

export interface JobOptions {
  name?: string;
  retries?: number;
  retryDelay?: number;
  preventOverlap?: boolean;
  onFailure?: (error: Error, job: Job) => void;
}

export interface Job {
  name: string;
  cronExpression: string;
  handler: () => Promise<void>;
  options: JobOptions;
  scheduledJob?: cron.ScheduledTask;
  isRunning: boolean;
  lastRun?: Date;
}

export interface LogEntry {
  jobName: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  status: 'success' | 'failure';
  errorMessage?: string;
}

export class SmartCron {
  private registry = new JobRegistry();
  private logger = new Logger();
  private notifier = new Notifier();
  private retryManager = new RetryManager();
  private jobRunner = new JobRunner(this.logger, this.notifier, this.retryManager);
  private scheduler = new Scheduler(this.jobRunner);

  schedule(
    cronExpression: string,
    handler: () => Promise<void>,
    options: JobOptions = {}
  ): Job {
    const name = options.name || `job-${Date.now()}`;
    const job: Job = {
      name,
      cronExpression,
      handler,
      options,
      isRunning: false,
    };
    this.registry.add(job);

    // Schedule the job
    this.scheduler.scheduleJob(job);

    return job;
  }

  start(name: string): void {
    const job = this.registry.get(name);
    if (!job) throw new Error(`Job ${name} not found`);
    this.scheduler.startJob(job);
  }

  stop(name: string): void {
    const job = this.registry.get(name);
    if (!job) throw new Error(`Job ${name} not found`);
    this.scheduler.stopJob(job);
  }

  remove(name: string): void {
    const job = this.registry.get(name);
    if (!job) throw new Error(`Job ${name} not found`);
    this.scheduler.destroyJob(job);
    this.registry.remove(name);
  }

  listJobs(): Job[] {
    return this.registry.list();
  }

  getLogs(): LogEntry[] {
    return this.logger.getLogs();
  }
}