import { SmartCron } from '../src/smartCron';

describe('SmartCron', () => {
  let cronManager: SmartCron;

  beforeEach(() => {
    cronManager = new SmartCron();
  });

  it('should schedule a job', () => {
    const job = cronManager.schedule('* * * * *', async () => {});
    expect(job.name).toBeDefined();
    expect(job.cronExpression).toBe('* * * * *');
  });

  it('should schedule a named job', () => {
    const job = cronManager.schedule('* * * * *', async () => {}, { name: 'test-job' });
    expect(job.name).toBe('test-job');
  });

  it('should throw error for duplicate job names', () => {
    cronManager.schedule('* * * * *', async () => {}, { name: 'test-job' });
    expect(() => {
      cronManager.schedule('* * * * *', async () => {}, { name: 'test-job' });
    }).toThrow('Job with name test-job already exists');
  });

  it('should list jobs', () => {
    cronManager.schedule('* * * * *', async () => {}, { name: 'job1' });
    cronManager.schedule('* * * * *', async () => {}, { name: 'job2' });
    const jobs = cronManager.listJobs();
    expect(jobs.length).toBe(2);
    expect(jobs.map(j => j.name)).toEqual(['job1', 'job2']);
  });

  it('should remove a job', () => {
    cronManager.schedule('* * * * *', async () => {}, { name: 'test-job' });
    cronManager.remove('test-job');
    const jobs = cronManager.listJobs();
    expect(jobs.length).toBe(0);
  });

  it('should throw error for unknown job', () => {
    expect(() => cronManager.start('unknown')).toThrow('Job unknown not found');
    expect(() => cronManager.stop('unknown')).toThrow('Job unknown not found');
    expect(() => cronManager.remove('unknown')).toThrow('Job unknown not found');
  });
});