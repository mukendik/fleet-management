export function getApiErrorMessage(err) {
  const data = err?.response?.data;

  if (!data) return "Network error";

  // 1. FIELD ERRORS (VALIDATION BACKEND)
  if (Array.isArray(data.details) && data.details.length > 0) {
    return data.details
      .map((e) => {
        const field = e.field || e.loc?.[1] || "field";
        const message = e.message || e.msg || "Invalid value";
        return `${field}: ${message}`;
      })
      .join("\n");
  }

  // 2. FALLBACK BACKEND MESSAGE
  return (
    data.message ||
    data.detail ||
    data.error ||
    err?.message ||
    "Unexpected error"
  );
}