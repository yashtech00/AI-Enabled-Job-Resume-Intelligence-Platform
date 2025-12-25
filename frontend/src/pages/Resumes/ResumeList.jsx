import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteResume, getResumes } from "../../api/resume.api";

export const ResumeList = () => {
  const [resumeList, setResumeList] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const handleResumeList = async () => {
    const data = await getResumes();
    console.log(data, "resume list"); 
    const normalizedResumes = Array.isArray(data)
      ? data
      : Array.isArray(data?.data?.resumes)
        ? data.data.resumes
        : Array.isArray(data?.resumes)
          ? data.resumes
          : [];
    setResumeList(normalizedResumes);
  };

  useEffect(() => {
    handleResumeList();
  }, []);

  const handleDelete = async (resumeId) => {
    

    setDeletingId(resumeId);
    setError(null);
    try {
      const data = await deleteResume(resumeId);
      if (data?.success === false) {
        setError(data?.message || "Failed to delete resume");
        return;
      }
      await handleResumeList();
    } catch (e) {
      setError("Failed to delete resume");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Resumes</h1>
          <p className="mt-1 text-sm text-gray-500">Manage uploaded resumes.</p>
        </div>

        <Link
          to="/resumes/upload"
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Upload Resume
        </Link>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Candidate
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(Array.isArray(resumeList) ? resumeList : []).map((resume) => (
                <tr key={resume._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {resume.candidateName || resume.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{resume.email || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/chat/${resume._id}`}
                        className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Chat
                      </Link>
                      <button
                        onClick={() => handleDelete(resume._id)}
                        disabled={deletingId === resume._id}
                        className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === resume._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(Array.isArray(resumeList) ? resumeList : []).length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-500" colSpan={3}>
                    No resumes found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResumeList;