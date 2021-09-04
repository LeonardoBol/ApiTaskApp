import express from "express";
import jwt from 'jsonwebtoken';
import cors from 'cors';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';


//Opciones
import { options } from './swaggerOptions';
import { corsOptions } from './middleware/cors';
const path = require('path')

//Rutas
import authRoutes from "./routes/auth";
import userRoutes from './routes/user';
import taskRoutes from './routes/task';
import attachmentRoutes from './routes/attachments'
const multer = require('multer');

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads' ),
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
    }
)

//Opciones de Documentacion (localhost:5000/docs)
const specs = swaggerJSDoc(options);

const app = express();

app.use(cors(corsOptions));//Origenes Cruzados

app.use(morgan("dev"));//Ver por consola las peticiones del servidor


// parse requests of content-type - application/x-www-form-urlencoded


//Peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//********************************

app.use

app.use(multer({
    storage,
    dest: path.join(__dirname, 'public/uploads' ),
    limits: {fileSize: 2000000}
}).fields([{name: 'file', maxCount: 5}]));

// Static files
app.use(express.static(path.join(__dirname, 'public')))


//***************************Uso de Rutas*************************************
app.use(authRoutes);
app.use(userRoutes);
app.use(taskRoutes);
app.use(attachmentRoutes);



//Documentacion
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs))

export default app;