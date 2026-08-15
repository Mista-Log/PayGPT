const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("access");

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    let errorMessage = "Something went wrong";
    if (typeof data === "string") {
      errorMessage = data;
    } else if (data.detail) {
      errorMessage = data.detail;
    } else if (data.message) {
      errorMessage = data.message;
    } else if (data.non_field_errors) {
      errorMessage = Array.isArray(data.non_field_errors)
        ? data.non_field_errors.join(", ")
        : String(data.non_field_errors);
    } else if (typeof data === "object" && data !== null) {
      const fieldErrors = Object.entries(data)
        .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
        .join("; ");
      if (fieldErrors) errorMessage = fieldErrors;
    }
    throw new Error(errorMessage);
  }

  return data;
}