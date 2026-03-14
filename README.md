# Smart Cron Manager

[![npm version](https://badge.fury.io/js/cron-guardian.svg)](https://badge.fury.io/js/cron-guardian)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

A reliable cron job manager for Node.js applications with retries, monitoring, and job control.

## Features

- ✅ **Cron Scheduling**: Standard cron expressions with second precision
- ✅ **Named Jobs**: Unique identifiers with duplicate prevention
- ✅ **Automatic Retries**: Configurable retry logic with delays
- ✅ **Overlap Prevention**: Prevent concurrent job executions
- ✅ **Execution Logging**: Comprehensive logging with performance metrics
- ✅ **Failure Notifications**: Custom callbacks for error handling
- ✅ **Runtime Control**: Start, stop, and remove jobs dynamically
- ✅ **TypeScript Support**: Full type definitions included

## Installation

```bash
npm install cron-guardian
```

**Requirements:** Node.js ≥ 18.0.0

## Quick Start

```typescript
import { SmartCron } from 'cron-guardian';

const cronManager = new SmartCron();

// Schedule a simple job
cronManager.schedule('*/5 * * * *', async () => {
  console.log('Runs every 5 minutes');
});

// Schedule with advanced options
cronManager.schedule('0 */1 * * *', async () => {
  await processData();
}, {
  name: 'hourly-processor',
  retries: 3,
  retryDelay: 5000,
  preventOverlap: true,
  onFailure: (error, job) => {
    console.error(`Job ${job.name} failed:`, error.message);
  }
});

// Control jobs
cronManager.start('hourly-processor');
cronManager.stop('hourly-processor');
cronManager.remove('hourly-processor');

// Monitor
const jobs = cronManager.listJobs();
const logs = cronManager.getLogs();
```

## API Overview

### Core Methods
- `schedule(cronExpression, handler, options?)` - Schedule a new job
- `start(jobName)` - Start a stopped job
- `stop(jobName)` - Stop a running job
- `remove(jobName)` - Remove a job permanently
- `listJobs()` - Get all scheduled jobs
- `getLogs()` - Get execution logs

### Job Options
- `name` - Unique job identifier
- `retries` - Number of retry attempts
- `retryDelay` - Delay between retries (ms)
- `preventOverlap` - Prevent concurrent executions
- `onFailure` - Error callback function

## Examples

### Database Backup
```typescript
cronManager.schedule('0 2 * * *', async () => {
  const backup = await createBackup();
  await uploadToS3(backup);
}, {
  name: 'daily-backup',
  retries: 3,
  retryDelay: 300000,
  preventOverlap: true,
  onFailure: (error) => sendAlert(`Backup failed: ${error.message}`)
});
```

### API Health Check
```typescript
cronManager.schedule('*/5 * * * *', async () => {
  const response = await fetch('https://api.example.com/health');
  if (!response.ok) throw new Error('API unhealthy');
}, {
  name: 'health-check',
  retries: 2,
  onFailure: (error) => console.error('Health check failed:', error.message)
});
```

## Documentation

📖 **[Complete Documentation](DOCS.md)** - Includes:
- Detailed API reference
- Advanced usage examples
- Edge cases and error handling
- Best practices
- Troubleshooting guide
- Performance considerations

## Testing

```bash
# Run tests
npm test

# Build the project
npm run build

# Run example
node test-example.js
```

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions welcome! Please see the [contributing guidelines](CONTRIBUTING.md) and [complete documentation](DOCS.md) for details.

---

**Version:** 1.0.0 | **Node.js:** ≥18.0.0 | **TypeScript:** ≥4.0.0