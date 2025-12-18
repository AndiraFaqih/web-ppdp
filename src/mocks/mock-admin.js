import { initialEmployees } from "./mock-data";

const STORAGE_KEY = "mock_employees";

const _load = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEmployees));
  return initialEmployees.slice();
};

const getAttendance = async () => {
  // Build a simple attendance list for admin view using employees
  const employees = _load();
  const attendance = employees.map((emp, idx) => ({
    id: idx + 1,
    employee: emp,
    photo: null,
    attendanceTime: "09:00",
  }));
  return Promise.resolve({ data: { attendance } });
};

const addEmployee = async (employeeData) => {
  const list = _load();
  const next = { id: Date.now(), ...employeeData };
  list.push(next);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return Promise.resolve({ data: { employee: next } });
};

const getEmployees = async () => {
  return Promise.resolve({ data: { employees: _load() } });
};

const getEmployeeById = async (id) => {
  return Promise.resolve({ data: { employee: _load().find((e) => String(e.id) === String(id)) } });
};

const updateEmployee = async (employeeData, id) => {
  const list = _load();
  const idx = list.findIndex((e) => String(e.id) === String(id));
  if (idx === -1) return Promise.reject(new Error("Not found"));
  list[idx] = { ...list[idx], ...employeeData };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return Promise.resolve({ data: { employee: list[idx] } });
};

const deleteEmployee = async (id) => {
  const list = _load();
  const next = list.filter((e) => String(e.id) !== String(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return Promise.resolve({ data: { success: true } });
};

export const mockAdminService = {
  getAttendance,
  addEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};

export default mockAdminService;
