import axios from 'axios';
import mockEmployees from '../mock/employees.js';

export const USE_MOCK = true;

const API_BASE = 'http://localhost:8000/api';

export async function getEmployees() {
  if (USE_MOCK) return [...mockEmployees];
  const { data } = await axios.get(`${API_BASE}/employees`);
  return data.data ?? data;
}

export async function createEmployee(payload) {
  if (USE_MOCK) return { id: Date.now(), ...payload };
  const { data } = await axios.post(`${API_BASE}/employees`, payload);
  return data.data ?? data;
}
