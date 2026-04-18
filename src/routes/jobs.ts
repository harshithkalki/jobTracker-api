import { Router } from "express";
import { createJob, getJobs, DeleteJob, UpdateJob, UpdateJobStatus, getJobById } from "../controllers/jobControllers";
import { TokenAuth } from "../middleware/auth";

const router= Router();

router.post("/new", TokenAuth, createJob);
router.get("/alljobs", TokenAuth, getJobs);
router.delete("/:id", TokenAuth, DeleteJob);
router.put("/:id", TokenAuth, UpdateJob);
router.patch("/:id/status", TokenAuth, UpdateJobStatus);
router.get("/:id", TokenAuth,getJobById);




export default router;