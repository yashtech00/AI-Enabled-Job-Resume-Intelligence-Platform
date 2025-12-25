
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard/dashboard";
import JobList from "./pages/Jobs/jobList";
import CreateJob from "./pages/Jobs/createJob";
import ResumeList from "./pages/Resumes/ResumeList";
import UploadResume from "./pages/Resumes/Uploadresume";
import ResumeChat from "./pages/Chat/ResumeChat";
import JobDetails from "./pages/Jobs/jobDetails";
import MatchResult from "./pages/Matching/MatchResult";
import NotFound from "./api/NotFound";

// Layout (optional but recommended)
import Layout from "./components/layout/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Jobs */}
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/create" element={<CreateJob />} />
          <Route path="/jobs/:jobId" element={<JobDetails />} />

          {/* Resumes */}
          <Route path="/resumes" element={<ResumeList />} />
          <Route path="/resumes/upload" element={<UploadResume />} />

          {/* Resume Chat */}
          <Route path="/chat/:resumeId" element={<ResumeChat />} />

          {/* Matches */}
          <Route path="/matches/:jobId" element={<MatchResult />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
