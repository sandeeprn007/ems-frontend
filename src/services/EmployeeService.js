import apiClient from "./AxiosConfig";

const REST_API_BASE_URL = "/employees";

export const listEmployees = (page = 0, size = 5, sortBy = "id", sortDir = "asc") =>
    apiClient.get(REST_API_BASE_URL, {
        params: { page, size, sortBy, sortDir }
    });

export const searchEmployees = (keyword) =>
    apiClient.get(REST_API_BASE_URL + "/search", {
        params: { keyword }
    });

export const createEmployee = (employee) => apiClient.post(REST_API_BASE_URL, employee);

export const getEmployee = (employeeId) => apiClient.get(REST_API_BASE_URL + '/' + employeeId);

export const updateEmployee = (employeeId, employee) => apiClient.put(REST_API_BASE_URL + '/' + employeeId, employee);

export const deleteEmployee = (employeeId) => apiClient.delete(REST_API_BASE_URL + '/' + employeeId);
