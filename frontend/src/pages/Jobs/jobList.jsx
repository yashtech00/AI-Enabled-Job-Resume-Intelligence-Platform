import { getAllJobs } from "../../api/job.api";

export const jobsList = () => {
    const [jobList, setJobList] = useState([]);
    const handleJobList = async () => {
        const jobList = await getAllJobs();
        setJobList(jobList);
    }
    useEffect(() => {
        handleJobList();
    }, []);

    if (!jobList) {
        return <NotFound />
    }
    return (
        <div>
            <h1>Job List</h1>
            {jobList.map((jobs) => {
                <div>
                        <table>
                            <tr>
                                <th>{jobs.title}</th>
                                <th>{jobs.description}</th>
                            </tr>
                        </table>
                </div>
            })}
        </div>
    )
}