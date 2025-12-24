import baseUrl from "./base-url";

// Function to add laporan
const addLaporan = async (laporanData) => {
  try {
    const apiUrl = `${baseUrl()}/laporan`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(laporanData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding laporan: ", error);
    throw error;
  }
};

// Function to get all laporan
const getLaporan = async () => {
  try {
    const apiUrl = `${baseUrl()}/laporan`;

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
    console.error("Error fetching laporan data: ", error);
    throw error;
  }
};

// Function to get laporan by nomorLHP
const getLaporanByNomorLHP = async (nomorLHP) => {
  try {
    const encodedNomorLHP = encodeURIComponent(nomorLHP);
    const apiUrl = `${baseUrl()}/laporan/${encodedNomorLHP}`;

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
    console.error("Error fetching laporan by nomorLHP: ", error);
    throw error;
  }
};

// Function to update laporan
const updateLaporan = async (nomorLHP, updateData) => {
  try {
    const encodedNomorLHP = encodeURIComponent(nomorLHP);
    const apiUrl = `${baseUrl()}/laporan/${encodedNomorLHP}`;

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
    console.error("Error updating laporan: ", error);
    throw error;
  }
};

// Function to delete laporan
const deleteLaporan = async (nomorLHP) => {
  try {
    const encodedNomorLHP = encodeURIComponent(nomorLHP);
    const apiUrl = `${baseUrl()}/laporan/${encodedNomorLHP}`;

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
    console.error("Error deleting laporan: ", error);
    throw error;
  }
};

// Function to upload dokumen
const uploadDokumen = async (nomorLHP, formData, rekomendasiId = null) => {
  try {
    const encodedNomorLHP = encodeURIComponent(nomorLHP);
    let apiUrl = `${baseUrl()}/laporan/${encodedNomorLHP}/dokumen`;
    
    // Add rekomendasiId as query parameter if provided
    if (rekomendasiId) {
      apiUrl += `?rekomendasiId=${rekomendasiId}`;
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading dokumen: ", error);
    throw error;
  }
};

// Function to get dokumen by nomorLHP
const getDokumenByNomorLHP = async (nomorLHP) => {
  try {
    const encodedNomorLHP = encodeURIComponent(nomorLHP);
    const apiUrl = `${baseUrl()}/laporan/${encodedNomorLHP}/dokumen`;

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
    console.error("Error fetching dokumen by nomorLHP: ", error);
    throw error;
  }
};

// Function to get dokumen file (returns blob)
const getDokumenFile = async (id) => {
  try {
    const apiUrl = `${baseUrl()}/dokumen/${id}/file`;

    const response = await fetch(apiUrl, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error fetching dokumen file: ", error);
    throw error;
  }
};

// Function to delete dokumen
const deleteDokumen = async (id) => {
  try {
    const apiUrl = `${baseUrl()}/laporan/dokumen/${id}`;

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
    console.error("Error deleting dokumen: ", error);
    throw error;
  }
};

// Function to update dokumen
const updateDokumen = async (id, formData) => {
  try {
    const apiUrl = `${baseUrl()}/laporan/dokumen/${id}`;

    const response = await fetch(apiUrl, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating dokumen: ", error);
    throw error;
  }
};

// Function to reject bukti by nomorLHP and rekomendasiId
const rejectBuktiByNomorLHP = async (nomorLHP, rekomendasiId) => {
  try {
    const encodedNomorLHP = encodeURIComponent(nomorLHP);
    const apiUrl = `${baseUrl()}/laporan/${encodedNomorLHP}/reject-bukti`;

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rekomendasiId }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error rejecting bukti: ", error);
    throw error;
  }
};

// Function for first approval of bukti
const buktiFirstApprovalByNomorLHP = async (nomorLHP, rekomendasiId) => {
  try {
    const encodedNomorLHP = encodeURIComponent(nomorLHP);
    const apiUrl = `${baseUrl()}/laporan/${encodedNomorLHP}/bukti-first-approval`;

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rekomendasiId }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error first approval bukti: ", error);
    throw error;
  }
};

// Function for second approval of bukti
const buktiSecondApprovalByNomorLHP = async (nomorLHP, rekomendasiId) => {
  try {
    const encodedNomorLHP = encodeURIComponent(nomorLHP);
    const apiUrl = `${baseUrl()}/laporan/${encodedNomorLHP}/bukti-second-approval`;

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rekomendasiId }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error second approval bukti: ", error);
    throw error;
  }
};

export const laporanService = {
  addLaporan,
  getLaporan,
  getLaporanByNomorLHP,
  updateLaporan,
  deleteLaporan,
  uploadDokumen,
  getDokumenByNomorLHP,
  getDokumenFile,
  deleteDokumen,
  updateDokumen,
  rejectBuktiByNomorLHP,
  buktiFirstApprovalByNomorLHP,
  buktiSecondApprovalByNomorLHP,
  updateTemuanById: async (temuanId, updateData) => {
    try {
      const response = await fetch(`${baseUrl()}/temuan/${temuanId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating temuan:", error);
      throw error;
    }
  },
  
  // Add new temuan to existing laporan
  addTemuanToLaporan: async (nomorLHP, temuanData) => {
    try {
      const encodedNomorLHP = encodeURIComponent(nomorLHP);
      const response = await fetch(`${baseUrl()}/rekomendasi/temuan/${encodedNomorLHP}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(temuanData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding temuan:", error);
      throw error;
    }
  },
};

