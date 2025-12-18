import baseUrl from "./base-url";
import { isOffline } from "./offline";
import { mockAttendanceService } from "../mocks/mock-attendance";

//function to get attendance by employee
const getAttendanceByEmployee = async () => {
  if (isOffline()) return mockAttendanceService.getAttendanceByEmployee();

  try {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      throw new Error("JWT token is not available");
    }

    const apiUrl = `${baseUrl()}/attendance/`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching attendance data: ", error);
  }
};

//function to mark attendance
const markAttendance = async (photoFile) => {
  if (isOffline()) return mockAttendanceService.markAttendance(photoFile);

  try {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      throw new Error("JWT token is not available");
    }

    const apiUrl = `${baseUrl()}/attendance/mark`;

    const formData = new FormData();
    formData.append("photo", photoFile);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the parsed data
    return data;
  } catch (error) {
    console.error("Error marking attendance:", error);
    throw error;
  }
};

export const attendanceService = {
  getAttendanceByEmployee,
  markAttendance,
};
