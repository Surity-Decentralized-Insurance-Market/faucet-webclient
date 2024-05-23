export const serverUrl =
  import.meta.env.MODE === "development" || !import.meta.env.VITE_BACKEND_URL
    ? "http://localhost:9090"
    : import.meta.env.VITE_BACKEND_URL;
