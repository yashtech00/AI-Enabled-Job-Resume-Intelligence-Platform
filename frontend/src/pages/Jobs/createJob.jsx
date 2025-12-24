export const CreateJob = () => {
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createJob({ jobTitle, jobDescription });
        navigate("/jobs");
    }
    return (
        <div >
            <form onSubmit={handleSubmit}>
            <div>
                <lable>JobTitle</lable>
                <input type="text" placeholder="JobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            </div>
            <div>
                <lable>JobDescription</lable>
                <input type="text" placeholder="JobDescription" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
            </div>
                <button type="submit">Submit</button>
                </form>
        </div>
    )
}