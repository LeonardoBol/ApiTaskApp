import { Router } from "express";
import { getUsers } from "../controllers/taskController";
import {store,list,show,update,destroy} from "../controllers/userController"
import {ensureToken, verifyToken} from '../middleware/token';


const router = Router();

/**
 * @swagger
 * /users:
 *  get:
 *    summary: Lista de usuarios
 *    tags: [Users]
 */
 router.get("/api/users", ensureToken,verifyToken, list );

/**
 * @swagger
 * /users:
 *  post:
 *    summary: Creación de Usuarios
 *    tags: [Users]
 */
router.post("/api/users",ensureToken,verifyToken, store);

/**
 * @swagger
 * /users/id:
 *  get:
 *    summary: Visualizacion de Usuario
 *    tags: [Users]
 */
 router.get("/api/users/:id",ensureToken,verifyToken, show );

/**
 * @swagger
 * /users/id:
 *  put:
 *    summary: Actualizacion del Usuario
 *    tags: [Users]
 */
 router.put("/api/users/:id",ensureToken,verifyToken, update );

 /**
 * @swagger
 * /users/id:
 *  delete:
 *    summary: Eliminacion de usuario
 *    tags: [Users]
 */
  router.delete("/api/users/:id",ensureToken,verifyToken, destroy );


export default router;