import { Router } from "express";
import { deleteDocument, getDocuments, getPresignedUrl, saveDocument } from "../controllers/documentController";
import { TokenAuth } from "../middleware/auth";

const router=Router();

router.get("/getdocurl/:jobId",TokenAuth, getPresignedUrl);
router.get("/getdocs/:jobId",TokenAuth, getDocuments);
router.delete("/:documentId",TokenAuth, deleteDocument);
router.post("/:jobId",TokenAuth, saveDocument);

export default router;