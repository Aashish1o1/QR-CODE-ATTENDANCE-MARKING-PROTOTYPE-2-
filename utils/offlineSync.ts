import { submitAttendance } from "./api";
import {
  getOfflineQueue,
  removeFromOfflineQueue,
  upgradePendingRecordToPresent,
  OfflineSubmission,
} from "./storage";

export async function processOfflineQueue(): Promise<{
  processed: number;
  failed: number;
}> {
  const queue = await getOfflineQueue();
  let processed = 0;
  let failed = 0;

  for (const submission of queue) {
    try {
      const result = await submitAttendance({
        studentId: submission.studentId,
        token: submission.token,
      });

      if (result.success) {
        await removeFromOfflineQueue(submission.id);
        await upgradePendingRecordToPresent(submission.studentId, submission.timestamp);
        processed++;
      } else {
        failed++;
      }
    } catch (error) {
      failed++;
    }
  }

  return { processed, failed };
}
