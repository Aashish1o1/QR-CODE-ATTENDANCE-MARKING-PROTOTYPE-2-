const API_BASE_URL = "https://comeon-dl9k.onrender.com";

export async function submitAttendance({ studentId, token }) {
  try {
    // Extract token safely (supports both pure token or token inside URL)
    const match = token.match(/token=([0-9]+)/);
    const cleanToken = match ? match[1] : token;

    const formData = `student_id=${encodeURIComponent(studentId)}&token=${encodeURIComponent(cleanToken)}`;

    const response = await fetch(`${API_BASE_URL}/scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow",  // <-- IMPORTANT FIX
      body: formData,
    });

    const text = await response.text();
    console.log("SERVER RESPONSE:", text);

    if (response.ok && (text.includes("Present") || text.includes("Welcome"))) {
      return {
        success: true,
        studentName: studentId,
        message: "Attendance marked successfully",
      };
    }

    return {
      success: false,
      message: "Invalid token or student ID",
    };

  } catch (error) {
    console.log("API ERROR:", error);
    throw new Error("Network error. Try again.");
  }
}
