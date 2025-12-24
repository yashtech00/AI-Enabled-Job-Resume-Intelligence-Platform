import { axiosInstance } from "./axiosInstances";

export const analyzeResume = async (data) => {
    try {
        const response = await axiosInstance.post("/match/analyze-resume", data);
        return response.data;
    } catch (e) {
        return e?.response?.data;
    }
}

export const rankResumesForJob = async (data) => {
    try {
        const response = await axiosInstance.post("/match/rank-resume", data);
        return response.data;
    } catch (e) {
        return e?.response?.data;
    }
}

export const getMatchesByJob = async (jobId, params = {}) => {
    try {
        const response = await axiosInstance.get(`/match/job/${jobId}`, { params });
        return response.data;
    } catch (e) {
        return e?.response?.data;
    }
}

export const deleteMatch = async (id) => {
    try {
        const response = await axiosInstance.delete(`/match/delete-match/${id}`);
        return response.data;
    } catch (e) {
        return e?.response?.data;
    }
}
