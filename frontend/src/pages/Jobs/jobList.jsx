import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllJobs } from "../../api/job.api";

export const JobsList = () => {
  const [jobList, setJobList] = useState([]);

  const truncateWords = (text, maxWords = 25) => {
    const value = (text ?? "").toString().trim();
    if (!value) return "";
    const words = value.split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return value;
    return `${words.slice(0, maxWords).join(" ")}...`;
  };

  const handleJobList = async () => {
    const data = await getAllJobs();
    const normalizedJobs = Array.isArray(data)
      ? data
      : Array.isArray(data?.jobs)
        ? data.jobs
        : Array.isArray(data?.data)
          ? data.data
          : [];
    setJobList(normalizedJobs);
  };

  useEffect(() => {
    handleJobList();
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
          <p className="mt-1 text-sm text-gray-500">Browse all job postings.</p>
        </div>
        <Link
          to="/jobs/create"
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Create Job
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Description
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(Array.isArray(jobList) ? jobList : []).map((job) => (
                <tr key={job._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{job.jobTitle ?? job.title}</td>
                  <td
                    className="px-4 py-3 text-sm text-gray-600"
                    title={(job.jobDescription ?? job.description) || ""}
                  >
                    {truncateWords(job.jobDescription ?? job.description, 25)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        View
                      </Link>
                      <Link
                        to={`/matches/${job._id}`}
                        className="text-sm font-medium text-gray-900 hover:text-gray-700"
                      >
                        Match
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {jobList.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-500" colSpan={3}>
                    No jobs found.
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

export default JobsList;