import express from "express";
import jwt from 'jsonwebtoken';
import cors from 'cors';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';


//Opciones
import {options} from './swaggerOptions';
import {corsOptions} from './middleware/cors';

//Rutas
import authRoutes from "./routes/auth";
import userRoutes from './routes/user';
import taskRoutes from './routes/task';

//Opciones de Documentacion (localhost:5000/docs)
const specs = swaggerJSDoc(options);

const app = express();

app.use(cors(corsOptions));//Origenes Cruzados

app.use(morgan("dev"));//Ver por consola las peticiones del servidor


// parse requests of content-type - application/x-www-form-urlencoded


//Peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//***************************Uso de Rutas*************************************
app.use(authRoutes);
app.use(userRoutes);
app.use(taskRoutes);



//Documentacion
app.use('/docs',swaggerUI.serve,swaggerUI.setup(specs))

export default app;