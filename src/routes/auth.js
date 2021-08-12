import { Router } from "express";
import {corsOptions} from '../middleware/cors';
import {ensureToken,verifyToken} from '../middleware/token';
import {login,getAuthUser,forgotPassword,newPassword} from '../controllers/authController';

const router = Router();

/**
 * @swagger
 * /login:
 *  post:
 *    summary: Inicio de Sesión de los Usuarios
 *    tags: [Auth]
 */
router.post("/api/login",login);

/**
 * @swagger
 * /havePermission:
 *  get:
 *    summary: Prueba de JWT Token
 *    tags: [Auth]
 */
router.get("/api/auth-user", ensureToken,verifyToken ,getAuthUser);

/**
 * @swagger
 * /forgot-password:
 *  get:
 *    summary: Envia un token al correo electronico con la URL para cambiar la contraseña
 *    tags: [Auth]
 */
router.put("/api/forgot-password",forgotPassword);

/**
 * @swagger
 * /create-new-password:
 *  get:
 *    summary: Creacion de nueva contraseña si recibe el token de recuperar contraseña
 *    tags: [Auth]
 */
router.put("/api/create-new-password/:token" ,newPassword);

export default router;