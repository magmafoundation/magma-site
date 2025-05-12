export function getBaseUrl(requestHeaders: Headers) {
  // Get host from request headers
  const host = requestHeaders.get("host") || "localhost:3000";
  // Get protocol, default to https in production, http in development
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  return `${protocol}://${host}`;
}
