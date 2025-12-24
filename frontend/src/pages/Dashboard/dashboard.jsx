import React from "react";

export const dashboard = () => {
    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Overview of jobs, resumes and matches.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-sm font-medium text-gray-900">Jobs</div>
                    <div className="mt-1 text-sm text-gray-500">Create and manage job postings.</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-sm font-medium text-gray-900">Resumes</div>
                    <div className="mt-1 text-sm text-gray-500">Upload resumes and chat with candidates.</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-sm font-medium text-gray-900">Matching</div>
                    <div className="mt-1 text-sm text-gray-500">View match results for a job.</div>
                </div>
            </div>
        </div>
    );
}

export default dashboard;