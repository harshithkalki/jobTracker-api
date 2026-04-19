import { Router } from "express";
import { deleteDocument, downloadDocument, getDocuments, getPresignedUrl, saveDocument } from "../controllers/documentController";
import { TokenAuth } from "../middleware/auth";

const router=Router();

router.post("/getdocurl/:jobId",TokenAuth, getPresignedUrl);
router.get("/getdocs/:jobId",TokenAuth, getDocuments);
router.delete("/:documentId",TokenAuth, deleteDocument);
router.post("/:jobId",TokenAuth, saveDocument);
router.get("/download/:documentId",TokenAuth, downloadDocument);

export default router;