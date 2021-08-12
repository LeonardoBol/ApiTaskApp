import { conect } from "../database";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import { transporter } from '../mailer';

//Iniciar Sesión
export const login = async (req, res) => {
    try {
        const db = await conect();

        //Validacion de existencia del Usuario a traves del Correo
        const [rows] = await db.query("select * from users where email = ? limit 1", [req.body.email]);
        const user = rows[0];
        //Si no hay un usuario que devuelva un error
        if (user == undefined) {
            return res.json({ message: "El Usuario no existe" }, 200);
        }

        console.log(req.body.password);

        //Comparacion de contraseñas e inicio de sesion
        await bcrypt.compare(req.body.password, user.password, function (err, equals) {
            if (equals) {
                const auth_user = JSON.parse(JSON.stringify(user));
                const expireTime = 2880;
                const token = jwt.sign(auth_user, process.env.JWT_SECRET, { expiresIn: expireTime });

                return res.json({
                    'token': token,
                    "name": auth_user.name,
                    "email": auth_user.email,
                    'expiresIn': expireTime
                }, 200);
            }
            else {
                return res.sendStatus(401);
            }
        });
    }
    catch (e) {
        return res.json({
            'message': "Ha ocurrido un error en el servidor"
        }, 500);
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const email_user = req.body.email;
        if (email_user == undefined) {
            return res.json({ 'message': "El Correo es requerido" }, 400);
        }

        const db = await conect();
        let verificationLink;
        let emailStatus;

        //Validacion de existencia del Usuario a traves del Correo
        const [rows] = await db.query("select * from users where email = ? limit 1", [req.body.email]);
        const user = rows[0];
        //Si no hay un usuario que devuelva un error
        if (user == undefined) {
            return res.json({ message: "El Usuario no existe" }, 200);
        }

        //const token = "512412412";
        const expires = 600000;//10 Minutos
        const token = jwt.sign({ email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: 600000 });

        //Links de verificacion
        //verificationLink = process.env.SERVER_API + "/api/create-new-password/" + token;//API Test
        //verificationLink = process.env.EXTERNAL_SERVER + "/restorePassword?token=" + token;//Front End Test Old
        verificationLink = process.env.EXTERNAL_SERVER + "/auth/restore-password?token=" + token;//Front End Test New 

        const [saveResetToken] = await db.execute(
            "UPDATE users SET resetPasswordToken = ? where id = ?",
            [
                token, user.id
            ]
        );

        //Envio de correo

        console.log(user.email);

        transporter.sendMail({
            from: '"Ingenioitc" <devesteban44@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: "Reestablecer Contraseña", // Subject line
            text: "Hello world?", // plain text body
            html: `<h1>Por favor ingrese al link para restablecer su contraseña</h1>
            <br /><br />
            <a href=`+ verificationLink + `>Link</a>
            `
        });

        return res.json({
            'verificationLink': verificationLink,
            'expires': expires
        }, 200);
    }
    catch (e) {
        return res.json({
            'message': "Ha ocurrido un error en el servidor"
        }, 500);
    }
}

//Crear contraseña nueva si se olvido la contraseña
export const newPassword = async (req, res) => {
    try {
        //Validacion de Token y existencia de nueva contraseña
        const newPassword = req.body.password;
        const resetToken = req.params.token;
        let email;

        if (!(resetToken && newPassword)) {
            return res.json("Contraseña vacia o solicitud de restaurar contraseña no valida", 400)
        }

        //Validacion de Token y correo
        const jwtVerifyToken = await jwt.verify(resetToken, process.env.JWT_SECRET, (error, authData) => {
            email = authData.email;
        });

        if (email == null) {
            return res.json({ "message": "Ha ocurrido un error en el servidor" }, 500);
        }

        const db = await conect();

        //Validacion de existencia del Usuario a traves del Correo
        const [rows] = await db.query("select * from users where email = ? limit 1", [email]);
        const user = rows[0];
        //Si no hay un usuario que devuelva un error
        if (user == undefined) {
            return res.json({ message: "El Usuario no existe" }, 200);
        }

        const salt = await bcrypt.genSalt(12);
        let hashedPassword = await bcrypt.hash(newPassword, salt);


        await db.query("UPDATE users SET password = ? WHERE id = ?", [
            hashedPassword, user.id
        ]);


        return res.json({ message: "Contraseña cambiada con exito" }, 200);
    }
    catch (e) {
        return res.json({ "message": "Ha ocurrido un error en el servidor" }, 500);
    }
}



//Simulador de Permisos
export const getAuthUser = async (req, res) => {

    try {
        jwt.verify(req.token, process.env.JWT_SECRET, (error, authData) => {
            if (error) {
                return res.sendStatus(403);
            }
            else {
                return res.json(
                    {
                        id: authData.id,
                        email: authData.email,
                        name : authData.name,
                        role : authData.role,
                        iat : authData.iat,
                        exp: authData.exp
                    }, 200);
            }
        });
    }
    catch (e) {
        return res.json({ "message": "Ha ocurrido un error en el servidor" }, 500);
    }
}