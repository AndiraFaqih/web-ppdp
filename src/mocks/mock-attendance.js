import { mockAttendance } from "./mock-data";

const getAttendanceByEmployee = async () => {
  // Return stored attendance or defaults; keep API shape { data: { attendance: [] } }
  const stored = localStorage.getItem("mock_attendance");
  const list = stored ? JSON.parse(stored) : (localStorage.setItem("mock_attendance", JSON.stringify(mockAttendance)), mockAttendance);
  return { data: { attendance: list } };
};

const markAttendance = async (photoFile) => {
  // simulate adding one attendance record
  const list = (JSON.parse(localStorage.getItem("mock_attendance")) || []).slice();
  const newItem = {
    id: Date.now(),
    date: new Date().toISOString().split("T")[0],
    status: "present",
    time: new Date().toTimeString().split(" ")[0].slice(0,5),
  };
  list.unshift(newItem);
  localStorage.setItem("mock_attendance", JSON.stringify(list));
  return Promise.resolve({ success: true, attendance: newItem });
};

export const mockAttendanceService = { getAttendanceByEmployee, markAttendance };

export default mockAttendanceService;
