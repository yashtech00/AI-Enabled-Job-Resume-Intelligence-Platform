
export const uploadResume = async (data) => {
    try {
        const response = await axiosInstance.post("/resume/upload",data);
        return response.data;
    }catch (error) {
        error.response.data;
    }
}

export const getResumes = async () => {
    try {
        const response = await axiosInstance.get("/resume/get-resumes");
        return response.data;
    } catch (error) {
        error.response.data;
    }
}

export const getResumeById = async (resumeId) => {
    try {
        const response = await axiosInstance.get(`/resume/get-resume-by-id/${resumeId}`);
        return response.data;
    } catch (error) {
        error.response.data;
    }
}

export const deleteResume = async (resumeId) => {
    try {
        const response = await axiosInstance.delete(`/resume/delete-resume/${resumeId}`);
        return response.data;
    }catch (error) {
        error.response.data;
    }
}