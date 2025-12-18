import { mockUser, mockToken } from "./mock-data";

const makeToken = (role = "employee") => {
  // simple pseudo-JWT so jwt-decode can parse it in the client
  const header = typeof window !== "undefined" ? btoa(JSON.stringify({ alg: "none", typ: "JWT" })) : "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0";
  const payload = typeof window !== "undefined" ? btoa(JSON.stringify({ role })) : "eyJyb2xlIjoiZW1wbG95ZWUifQ";
  return `${header}.${payload}.`;
};

const login = async (credentials) => {
  // simplistic matching for offline demo
  if (!credentials || (!credentials.email && !credentials.username)) {
    return Promise.reject(new Error("Invalid credentials"));
  }

  const role = (credentials.email || credentials.username || "").includes("admin") ? "admin" : "employee";

  const token = makeToken(role);

  // Store token in localStorage to simulate auth
  localStorage.setItem("jwtToken", token);

  return Promise.resolve({ token, user: { ...mockUser, role } });
};

export const mockAuthService = { login };

export default mockAuthService;
