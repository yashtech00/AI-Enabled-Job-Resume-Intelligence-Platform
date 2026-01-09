import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { uploadResume } from "../../api/resume.api";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-2xl"
      >
        <Link to="/resumes" className="mb-6 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Resumes
        </Link>

        <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/5">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Upload Candidate Resume</h1>
            <p className="mt-2 text-gray-500">We'll parse the file to extract key information using AI.</p>
          </div>

          <form onSubmit={handleResumeUpload} className="space-y-6">
            <div className="relative flex min-h-[240px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center hover:bg-gray-100 transition-colors">
              <input
                type="file"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                accept=".pdf,.doc,.docx"
              />

              {resume ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{resume.name}</div>
                  <div className="text-xs text-gray-500">{(resume.size / 1024 / 1024).toFixed(2)} MB</div>
                  <button type="button" onClick={() => setResume(null)} className="mt-2 text-xs font-semibold text-red-500 hover:text-red-700 z-10">Remove file</button>
                </div>
              ) : (
                <>
                  <div className="mb-4 rounded-lg bg-white p-3 shadow-sm ring-1 ring-gray-200">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">Click to upload or drag and drop</div>
                  <div className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/resumes")}
                className="rounded-xl px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!resume || loading}
                className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-black hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Uploading...
                  </span>
                ) : "Analyze Resume"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadResume;