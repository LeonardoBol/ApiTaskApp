import { Router } from "express";
import { getAttachments, deleteAttachments, saveAttachmentEditTask, saveAttachmentCreateTask } from "../controllers/attachments";

const router = Router();

router.post("/api/attachments", saveAttachmentEditTask);

router.get("/api/attachments", getAttachments);

router.delete("/api/attachments", deleteAttachments);

router.post('/api/attachment', saveAttachmentCreateTask);

export default router;
