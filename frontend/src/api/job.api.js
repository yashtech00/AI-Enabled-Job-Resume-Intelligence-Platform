import { axiosInstance } from "./axiosInstances";

export const createJob = async(data) => {
    try {
        const response = await axiosInstance.post("/job/create-job", data);
        return response.data;
    }catch (error) {
        error.response.data;
    }   
}

export const getAllJobs = async () => {
    try {
        const response = await axiosInstance.get("/job/get-all-jobs");
        return response.data;
    } catch (e) {
        e.response.data;
    }
}

export const getJobById = async (jobId) => {
    try {
        const response = await axiosInstance.get(`/job/get-job-by-id/:${jobId}`);
        return response.data;   
    }catch (e) {
        e.response.data;
    }
}

export const scrapJobs = async (data) => {
    try {
        const response = await axiosInstance.post("/job/scrape-job", data);
        return response.data;
    }catch (e) {
        e.response.data;
    }
}