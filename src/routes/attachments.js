import { Router } from "express";
import { saveAttachment, getAttachments, deleteAttachments } from "../controllers/attachments";

const router = Router();

router.post("/api/attachments", saveAttachment);

router.get("/api/attachments", getAttachments);

router.delete("/api/attachments", deleteAttachments);

export default router;
