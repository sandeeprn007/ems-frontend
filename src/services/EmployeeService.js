import apiClient from "./AxiosConfig";

const REST_API_BASE_URL = "/employees";

export const listEmployees = () => apiClient.get(REST_API_BASE_URL);

export const createEmployee = (employee) => apiClient.post(REST_API_BASE_URL, employee);

export const getEmployee = (employeeId) => apiClient.get(REST_API_BASE_URL + '/' + employeeId);

export const updateEmployee = (employeeId, employee) => apiClient.put(REST_API_BASE_URL + '/' + employeeId, employee);

export const deleteEmployee = (employeeId) => apiClient.delete(REST_API_BASE_URL + '/' + employeeId);
