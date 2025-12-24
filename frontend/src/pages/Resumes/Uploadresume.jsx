

export const resumeUpload = () => {
    const [resume, setResume] = useState(null);
    const navigate = useNavigate();

    const handleResumeUpload = async (e) => {
        e.preventDefault();
        await uploadResume(resume);
        navigate("/resumes");
    }
    return (
       <div>
        <h1>Resume Upload</h1>
        <form onSubmit={handleResumeUpload}>
            <input type="file" onChange={(e) => setResume(e.target.files[0])} />
            <button type="submit">Upload</button>
        </form>
       </div>
   ) 
}