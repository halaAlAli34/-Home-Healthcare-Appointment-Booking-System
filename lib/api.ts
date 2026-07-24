const API_URL = "/api";


export async function getDashboardStats() {
  const response = await fetch(
    `${API_URL}/admin/dashboard`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  return response.json();
}