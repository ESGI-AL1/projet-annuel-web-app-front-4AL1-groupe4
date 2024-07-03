import { baseUrl } from "./axios.config";

baseUrl.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getPrograms = () => baseUrl.get("/programs/");

export const createProgram = (programData) => baseUrl.post("/programs/", programData);

export const deleteProgram = (programId) => baseUrl.delete(`/programs/delete/${programId}/`);

export const getPublicPrograms = () => baseUrl.get("/programs/public/all/");

export const updateProgram = (programId, programData) => baseUrl.put(`/programs/${programId}/`, programData);

export const patchProgram = (programId, programData) => baseUrl.patch(`/programs/${programId}/`, programData);

export const executeProgram = (formData) => baseUrl.post("/execute/", formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

export const runProgram = (formData) => baseUrl.post("/run/", formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

export const createPipeline = (formData) => {
    return baseUrl.post('/api/pipeline/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
