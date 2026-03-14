const { SmartCron } = require('./dist/index.js');

async function testSmartCron() {
  console.log('Testing Smart Cron Manager...\n');

  const cronManager = new SmartCron();

  // Test 1: Schedule a simple job
  console.log('1. Scheduling a simple job that runs every 10 seconds...');
  const job1 = cronManager.schedule('*/10 * * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Simple job executed`);
  }, { name: 'simple-job' });

  // Test 2: Schedule a job with retries and failure handling
  console.log('2. Scheduling a job with retries (will fail first 2 times)...');
  let attemptCount = 0;
  const job2 = cronManager.schedule('*/15 * * * * *', async () => {
    attemptCount++;
    console.log(`[${new Date().toISOString()}] Retry job attempt ${attemptCount}`);

    if (attemptCount <= 2) {
      throw new Error(`Simulated failure on attempt ${attemptCount}`);
    }

    console.log(`[${new Date().toISOString()}] Retry job succeeded on attempt ${attemptCount}`);
  }, {
    name: 'retry-job',
    retries: 3,
    retryDelay: 1000, // 1 second delay
    preventOverlap: true,
    onFailure: (error, job) => {
      console.log(`[${new Date().toISOString()}] FAILURE: Job ${job.name} failed: ${error.message}`);
    }
  });

  // Test 3: List jobs
  console.log('3. Listing all jobs:');
  const jobs = cronManager.listJobs();
  jobs.forEach(job => {
    console.log(`  - ${job.name}: ${job.cronExpression}`);
  });

  // Test 4: Job control
  console.log('\n4. Testing job control...');
  setTimeout(() => {
    console.log('Stopping simple-job...');
    cronManager.stop('simple-job');
  }, 25000); // Stop after 25 seconds

  setTimeout(() => {
    console.log('Starting simple-job again...');
    cronManager.start('simple-job');
  }, 35000); // Start again after 35 seconds

  // Test 5: Show logs periodically
  const logInterval = setInterval(() => {
    const logs = cronManager.getLogs();
    console.log(`\n5. Current logs (${logs.length} entries):`);
    logs.slice(-5).forEach(log => { // Show last 5 logs
      console.log(`  ${log.jobName}: ${log.status} (${log.duration}ms)`);
      if (log.errorMessage) {
        console.log(`    Error: ${log.errorMessage}`);
      }
    });
  }, 30000); // Every 30 seconds

  // Run for 2 minutes then cleanup
  setTimeout(() => {
    console.log('\n6. Cleaning up...');
    clearInterval(logInterval);
    cronManager.remove('simple-job');
    cronManager.remove('retry-job');

    const finalLogs = cronManager.getLogs();
    console.log(`\nFinal log summary (${finalLogs.length} total entries):`);
    const successCount = finalLogs.filter(l => l.status === 'success').length;
    const failureCount = finalLogs.filter(l => l.status === 'failure').length;
    console.log(`  Success: ${successCount}`);
    console.log(`  Failures: ${failureCount}`);

    console.log('\nTest completed!');
    process.exit(0);
  }, 120000); // 2 minutes
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Run the test
testSmartCron();