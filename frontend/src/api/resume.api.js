import { axiosInstance } from "./axiosInstances";

export const uploadResume = async (file) => {
    try {
        const formData = new FormData();
        formData.append("resume", file);
        const response = await axiosInstance.post("/resume/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response?.data;
    }catch (error) {
        return error?.response?.data ?? { success: false, message: error?.message };
    }
}

export const getResumes = async () => {
    try {
        const response = await axiosInstance.get("/resume/get-resumes");
        return response?.data;
    } catch (error) {
        return error?.response?.data ?? { success: false, message: error?.message };
    }
}

export const getResumeById = async (resumeId) => {
    try {
        const response = await axiosInstance.get(`/resume/get-resume-by-id/${resumeId}`);
        return response?.data;
    } catch (error) {
        return error?.response?.data ?? { success: false, message: error?.message };
    }
}

export const deleteResume = async (resumeId) => {
    try {
        const response = await axiosInstance.delete(`/resume/delete-resume/${resumeId}`);
        return response?.data;
    }catch (error) {
        return error?.response?.data ?? { success: false, message: error?.message };
    }
}

export const downloadResume = async (resumeId) => {
    try {
        const response = await axiosInstance.get(`/resume/download/${resumeId}`, {
            responseType: "blob",
        });

        const disposition = response?.headers?.["content-disposition"] || "";
        const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
        const filenameRaw = match?.[1] || match?.[2] || `resume-${resumeId}.pdf`;
        const filename = decodeURIComponent(filenameRaw);

        return { success: true, data: { blob: response.data, filename } };
    } catch (error) {
        return error?.response?.data ?? { success: false, message: error?.message };
    }
}