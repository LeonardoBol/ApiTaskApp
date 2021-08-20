import { Router } from "express";
import { deleteTasks, getTask, getTasks, storeTask, updateTask, changeStatusTask } from "../controllers/taskController";
import { ensureToken, verifyToken } from '../middleware/token';


const router = Router();

/**
 * @swagger
 * /users:
 *  post:
 *    summary: Consulta de tareas
 *    tags: [Tasks]
 */
router.get("/api/tasks/:id", ensureToken, verifyToken, getTasks);

router.get("/api/task",ensureToken, verifyToken, getTask);

router.post("/api/task", ensureToken, verifyToken, storeTask);

router.delete("/api/task", ensureToken, verifyToken, deleteTasks);

router.put("/api/task/:id", ensureToken, verifyToken, updateTask);

router.put("/api/statustask/:id", changeStatusTask)



export default router;