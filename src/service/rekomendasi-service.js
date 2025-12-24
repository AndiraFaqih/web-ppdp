import baseUrl from "./base-url";

// Function to add rekomendasi based on laporan nomorLHP
const addRekomendasi = async (nomorLHP, rekomendasiData) => {
  try {
    const encodedNomorLHP = encodeURIComponent(nomorLHP);
    const apiUrl = `${baseUrl()}/rekomendasi/${encodedNomorLHP}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rekomendasiData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding rekomendasi: ", error);
    throw error;
  }
};

// Function to update rekomendasi by id
const updateRekomendasi = async (id, updateData) => {
  try {
    const apiUrl = `${baseUrl()}/rekomendasi/laporan/${id}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating rekomendasi: ", error);
    throw error;
  }
};

// Function to delete rekomendasi by id
const deleteRekomendasi = async (id) => {
  try {
    const apiUrl = `${baseUrl()}/rekomendasi/${id}`;

    const response = await fetch(apiUrl, {
      method: "DELETE",
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
    console.error("Error deleting rekomendasi: ", error);
    throw error;
  }
};

// Function to get all rekomendasi by laporan nomorLHP
const getRekomendasiByNomorLHP = async (nomorLHP) => {
  try {
    const encodedNomorLHP = encodeURIComponent(nomorLHP);
    const apiUrl = `${baseUrl()}/rekomendasi/laporan/${encodedNomorLHP}`;

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
    console.error("Error fetching rekomendasi by nomorLHP: ", error);
    throw error;
  }
};

// Function to get rekomendasi by id
const getRekomendasiById = async (id) => {
  try {
    const apiUrl = `${baseUrl()}/rekomendasi/${id}`;

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
    console.error("Error fetching rekomendasi by id: ", error);
    throw error;
  }
};

const getRekomendasiByTemuanId = async (temuanId) => {
  try {
    const apiUrl = `${baseUrl()}/rekomendasi/rekomendasi-by-temuanid/${temuanId}`;

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
    console.error("Error fetching rekomendasi by temuanId: ", error);
    throw error;
  }
};

export const rekomendasiService = {
  addRekomendasi,
  updateRekomendasi,
  deleteRekomendasi,
  getRekomendasiByNomorLHP,
  getRekomendasiById,
  getRekomendasiByTemuanId,
};

