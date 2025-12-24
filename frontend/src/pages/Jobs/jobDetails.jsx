
export const jobDetail = () => {
    const { jobId } = useParams();
    const [jobDetails, setJobDetails] = useState([]);
    const handleJobDetails = async () => {
        const jobDetails = await getJobById(jobId);
        setJobDetails(jobDetails);
    }
    useEffect(() => {
        handleJobDetails();
    }, [jobId]);

    if(!jobDetails){
        return <NotFound />
    }
    return (
        <div>
            <h1>Job Details</h1>
            {jobDetails.map((jobDetail) => {
                return(
                    <div>
                        <p>{jobDetail._id}</p>
                        <p>{jobDetail.title}</p>
                        <p>{jobDetail.description}</p>
                    </div>
                )
            })}
        </div>
    )
}