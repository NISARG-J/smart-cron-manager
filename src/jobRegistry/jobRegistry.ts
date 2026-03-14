import { Job } from '../smartCron';

export class JobRegistry {
  private jobs: Map<string, Job> = new Map();

  add(job: Job): void {
    if (this.jobs.has(job.name)) {
      throw new Error(`Job with name ${job.name} already exists`);
    }
    this.jobs.set(job.name, job);
  }

  get(name: string): Job | undefined {
    return this.jobs.get(name);
  }

  remove(name: string): boolean {
    return this.jobs.delete(name);
  }

  list(): Job[] {
    return Array.from(this.jobs.values());
  }
}