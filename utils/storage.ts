import AsyncStorage from "@react-native-async-storage/async-storage";

const ROLL_NUMBER_KEY = "@attendance_roll_number";
const OFFLINE_QUEUE_KEY = "@attendance_offline_queue";
const ATTENDANCE_HISTORY_KEY = "@attendance_history";

export interface OfflineSubmission {
  id: string;
  studentId: string;
  token: string;
  timestamp: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  timestamp: number;
  date: string;
  status: "present" | "pending";
}

export async function saveRollNumber(rollNumber: string): Promise<void> {
  try {
    await AsyncStorage.setItem(ROLL_NUMBER_KEY, rollNumber);
  } catch (error) {
    console.error("Error saving roll number:", error);
  }
}

export async function getRollNumber(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(ROLL_NUMBER_KEY);
  } catch (error) {
    console.error("Error getting roll number:", error);
    return null;
  }
}

export async function clearRollNumber(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ROLL_NUMBER_KEY);
  } catch (error) {
    console.error("Error clearing roll number:", error);
  }
}

export async function addToOfflineQueue(
  studentId: string,
  token: string
): Promise<void> {
  try {
    const queue = await getOfflineQueue();
    const newSubmission: OfflineSubmission = {
      id: Date.now().toString(),
      studentId,
      token,
      timestamp: Date.now(),
    };
    queue.push(newSubmission);
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error("Error adding to offline queue:", error);
  }
}

export async function getOfflineQueue(): Promise<OfflineSubmission[]> {
  try {
    const queueJson = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    return queueJson ? JSON.parse(queueJson) : [];
  } catch (error) {
    console.error("Error getting offline queue:", error);
    return [];
  }
}

export async function removeFromOfflineQueue(id: string): Promise<void> {
  try {
    const queue = await getOfflineQueue();
    const updatedQueue = queue.filter((item) => item.id !== id);
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(updatedQueue));
  } catch (error) {
    console.error("Error removing from offline queue:", error);
  }
}

export async function clearOfflineQueue(): Promise<void> {
  try {
    await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
  } catch (error) {
    console.error("Error clearing offline queue:", error);
  }
}

export async function addAttendanceRecord(
  studentId: string,
  status: "present" | "pending" = "present"
): Promise<void> {
  try {
    const history = await getAttendanceHistory();
    const now = new Date();
    const record: AttendanceRecord = {
      id: Date.now().toString(),
      studentId,
      timestamp: now.getTime(),
      date: now.toLocaleDateString(),
      status,
    };
    history.unshift(record);
    await AsyncStorage.setItem(ATTENDANCE_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Error adding attendance record:", error);
  }
}

export async function getAttendanceHistory(): Promise<AttendanceRecord[]> {
  try {
    const historyJson = await AsyncStorage.getItem(ATTENDANCE_HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error("Error getting attendance history:", error);
    return [];
  }
}

export async function getAttendanceStats(): Promise<{
  totalRecords: number;
  presentCount: number;
  pendingCount: number;
  attendanceRate: number;
}> {
  try {
    const history = await getAttendanceHistory();
    const presentCount = history.filter((r) => r.status === "present").length;
    const pendingCount = history.filter((r) => r.status === "pending").length;
    const totalRecords = history.length;
    const attendanceRate = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

    return {
      totalRecords,
      presentCount,
      pendingCount,
      attendanceRate,
    };
  } catch (error) {
    console.error("Error getting attendance stats:", error);
    return {
      totalRecords: 0,
      presentCount: 0,
      pendingCount: 0,
      attendanceRate: 0,
    };
  }
}

export async function upgradePendingRecordToPresent(
  studentId: string,
  timestamp: number
): Promise<void> {
  try {
    const history = await getAttendanceHistory();
    const recordIndex = history.findIndex(
      (r) =>
        r.studentId === studentId &&
        r.status === "pending" &&
        Math.abs(r.timestamp - timestamp) < 5000
    );

    if (recordIndex !== -1) {
      history[recordIndex].status = "present";
      await AsyncStorage.setItem(ATTENDANCE_HISTORY_KEY, JSON.stringify(history));
    }
  } catch (error) {
    console.error("Error upgrading pending record:", error);
  }
}
