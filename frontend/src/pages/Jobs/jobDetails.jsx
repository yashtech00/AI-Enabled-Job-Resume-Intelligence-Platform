import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJobById } from "../../api/job.api";

export const jobDetail = () => {
  const { jobId } = useParams();
  const [jobDetails, setJobDetails] = useState(null);

  const handleJobDetails = async () => {
    const data = await getJobById(jobId);
    setJobDetails(data || null);
  };

  useEffect(() => {
    handleJobDetails();
  }, [jobId]);

  const job = Array.isArray(jobDetails) ? jobDetails[0] : jobDetails;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Job Details</h1>
          <p className="mt-1 text-sm text-gray-500">View the selected job posting.</p>
        </div>
        <Link
          to="/jobs"
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        {!job ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">ID</div>
              <div className="mt-1 text-sm text-gray-900">{job._id}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Title</div>
              <div className="mt-1 text-sm font-medium text-gray-900">{job.title}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Description</div>
              <div className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{job.description}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default jobDetail;