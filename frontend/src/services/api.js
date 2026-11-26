
const API_BASE_URL = "http://localhost:5002/api";

export const sendMessageToAI = async (messages) => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ messages })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "AI request failed");
  }

  return data.reply;
};

export const saveLead = async (leadData) => {
  const response = await fetch(`${API_BASE_URL}/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(leadData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to save lead");
  }

  return data.lead;
};


export const getLeads = async () => {
  const response = await fetch(`${API_BASE_URL}/leads`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to fetch leads");
  }

  return data;
};

export const getAppointments = async () => {
  const response = await fetch(`${API_BASE_URL}/appointments`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to fetch appointments");
  }

  return data;
};

export const createAppointment = async (appointmentData) => {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appointmentData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to create appointment");
  }

  return data;
};