import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getResumes } from "../../api/resume.api";

export const ResumeList = () => {
  const [resumeList, setResumeList] = useState([]);

  const handleResumeList = async () => {
    const data = await getResumes();
    const resumes = data?.data || data || [];
    setResumeList(resumes);
  };

  useEffect(() => {
    handleResumeList();
  }, []);

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
              {resumeList.map((resume) => (
                <tr key={resume._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {resume.candidateName || resume.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{resume.email || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/chat/${resume._id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Chat
                    </Link>
                  </td>
                </tr>
              ))}
              {resumeList.length === 0 ? (
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