import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../../api/resume.api";

export const UploadResume = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resume) return;
    setLoading(true);
    await uploadResume(resume);
    setLoading(false);
    navigate("/resumes");
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Upload Resume</h1>
        <p className="mt-1 text-sm text-gray-500">Upload a resume file to extract candidate information.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <form onSubmit={handleResumeUpload} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-900">Resume File</label>
            <input
              type="file"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
            />
            <p className="mt-2 text-xs text-gray-500">PDF/DOC formats recommended.</p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate("/resumes")}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!resume || loading}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadResume;