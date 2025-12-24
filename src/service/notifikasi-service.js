import baseUrl from "./base-url";

// Function to get all notifikasi
const getNotifikasi = async () => {
  try {
    const apiUrl = `${baseUrl()}/notifikasi`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;    
  } catch (error) {
    console.error("Error fetching notifikasi:", error);
    throw error;
  }
};

const generateNotifikasi = async () => {
  try {
    const apiUrl = `${baseUrl()}/notifikasi/generate`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating notifikasi:", error);
    throw error;
  }
};

const markAsRead = async (id) => {
  try {
    const apiUrl = `${baseUrl()}/notifikasi/${id}/read`;
    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error marking as read:", error);
    throw error;
  }
};

export const notifikasiService = { getNotifikasi, generateNotifikasi, markAsRead };