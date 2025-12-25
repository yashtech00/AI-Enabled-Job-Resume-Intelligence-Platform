import { z } from "zod";

export const jobSchema = z.object({
  jobTitle: z.string().min(3, "Title is too short"),
  jobDescription: z.string().min(10, "Description is too short"),
});
