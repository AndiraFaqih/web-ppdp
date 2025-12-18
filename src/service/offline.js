// Simple helper to detect offline/mock mode
export const isOffline = () => import.meta.env.VITE_OFFLINE === "true";

export default isOffline;
