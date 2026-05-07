import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 300000,
});

// Upload curriculum file
export const uploadCurriculum = async (file, batchName = '', batchYear = '2025-2026') => {
    const formData = new FormData();
    formData.append('file', file);
    if (batchName) formData.append('batch_name', batchName);
    if (batchYear) formData.append('batch_year', batchYear);

    const response = await api.post('/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// Analyze curriculum
export const analyzeCurriculum = async (curriculumId) => {
    const response = await api.post(`/analyze/${curriculumId}/`);
    return response.data;
};

// Get analysis details
export const getAnalysis = async (analysisId) => {
    const response = await api.get(`/analysis/${analysisId}/`);
    return response.data;
};

// Get all batches
export const getBatches = async () => {
    const response = await api.get('/batches/');
    return response.data;
};

// Create batch
export const createBatch = async (data) => {
    const response = await api.post('/batches/', data);
    return response.data;
};

// Get all curricula
export const getCurricula = async () => {
    const response = await api.get('/curricula/');
    return response.data;
};

// Get all analyses
export const getAnalyses = async () => {
    const response = await api.get('/analysis/');
    return response.data;
};

// Download analysis report
export const downloadReport = (analysisId) => {
    window.open(`${API_BASE_URL}/download/${analysisId}/`, '_blank');
};

export default api;
