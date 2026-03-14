export class RetryManager {
  async runWithRetries(
    handler: () => Promise<void>,
    retries: number,
    delay: number
  ): Promise<void> {
    let attempts = 0;
    while (attempts <= retries) {
      try {
        await handler();
        return;
      } catch (error) {
        attempts++;
        if (attempts > retries) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
}