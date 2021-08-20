import { conect } from "../database";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

//Validacion de Campos
const validateAllUserFields = (request) => {
    const successStatus =
    {
        success: true,
        messages: [
            ''
        ]
    };
    if (request.name == undefined) {
        successStatus.success = false;
        successStatus.messages.push("El nombre es requerido");
    }
    if (request.document == undefined) {
        successStatus.success = false;
        successStatus.messages.push("El número de documento es requerido");
    }
    if (request.email == undefined) {
        successStatus.success = false;
        successStatus.messages.push("El correo es requerido");
    }
    if (request.password == undefined) {
        successStatus.success = false;
        successStatus.messages.push("La contraseña es requerida");
    }
    if (request.address == undefined) {
        successStatus.success = false;
        successStatus.messages.push("La dirección es requerida");
    }
    if (request.phone == undefined) {
        successStatus.success = false;
        successStatus.messages.push("El telefono es requerido");
    }
    return successStatus;
}

//Validacion de campos actualizacion de usuario
const validateUpdateUserFields = (request) => {
    const successStatus =
    {
        success: true,
        messages: [
            ''
        ]
    };
    if (request.name == undefined) {
        successStatus.success = false;
        successStatus.messages.push("El nombre es requerido");
    }
    if (request.document == undefined) {
        successStatus.success = false;
        successStatus.messages.push("El número de documento es requerido");
    }
    if (request.email == undefined) {
        successStatus.success = false;
        successStatus.messages.push("El correo es requerido");
    }
    if (request.address == undefined) {
        successStatus.success = false;
        successStatus.messages.push("La dirección es requerida");
    }
    if (request.phone == undefined) {
        successStatus.success = false;
        successStatus.messages.push("El telefono es requerido");
    }
    return successStatus;
}

//Registro de Usuario
export const store = async (req, res) => {
    try {
        //Valida la conexion a la base de datos
        const conn = await conect();

        const sucessValidate = validateAllUserFields(req.body);

        if (sucessValidate.success === false) {
            return res.json({ sucessValidate }, 200);
        }
        else {

            //Validacion de existencia del Usuario a traves del Correo
            const [rows] = await conn.query("select * from users where email = ? limit 1", [req.body.email]);
            const exist_user = rows[0];
            //Si no hay un usuario que devuelva un error
            if (exist_user != undefined) {
                return res.json({ message: "Ya existe un usuario con este correo electronico" }, 200);
            }

            console.log(req.body);

            //Guardado del usuario
            const user =
            {
                name: req.body.name,
                document: req.body.document,
                email: req.body.email,
                password: req.body.password,
                address: req.body.address,
                phone: req.body.phone,
                role: 2
            }

            //Encriptación de contraseña

            const salt = await bcrypt.genSalt(12);
            user.password = await bcrypt.hash(user.password, salt);

            const [results] = await conn.execute(
                "INSERT INTO users(name,document,email,password,address,phone,role) VALUES (?,?,?,?,?,?,?)",
                [
                    user.name,
                    user.document,
                    user.email,
                    user.password,
                    user.address,
                    user.phone,
                    user.role
                ]
            );

            return res.json({
                message: "Registro exitoso",
                user: user
            }, 200);
        }
    }
    catch (e) {
        console.log(e);
        return res.json({ message: "Ha ocurrido un error en el servidor" }, 500);
    }
}

//Listar Usuarios
export const list = async (req, res) => {
    try {

        /*let exceptEmail = null;//Correo que no debe encontrarse
        jwt.verify(req.token, process.env.JWT_SECRET, (error, authData) => {
            if (error) {
                return res.sendStatus(403);
            }
            else {
                exceptEmail = authData.email;
            }
        });*/
        const conn = await conect();
        //Validacion de existencia del Usuario a traves del Correo
        const [users] = await conn.query("select * from users");

        //return res.json({message: "Consulta exitosa"}, 200);
        return res.json(users, 200);
    }
    catch (e) {
        console.log(e);
        return res.json({ message: "Ha ocurrido un error en el servidor" }, 500);
    }
}

//Ver Usuario
export const show = async (req, res) => {
    try {

        let userId = req.params.id;
        const conn = await conect();
        //Validacion de existencia del Usuario a traves del Correo
        const [users] = await conn.query("select * from users where id = ? limit 1", [userId]);

        if (users.length > 0) {
            return res.json({ message: "Usuario consultado con exito", user: users[0] }, 200);
        }
        else {
            return res.json({ message: "El Usuario no existe" }, 200);
        }


    }
    catch (e) {
        console.log(e);
        return res.json({ message: "Ha ocurrido un error en el servidor" }, 500);
    }
}

//Actualizar Usuario
export const update = async (req, res) => {
    try {

        let userId = req.params.id;

        //Valida la conexion a la base de datos
        const conn = await conect();
        const [users] = await conn.query("select * from users where id = ? limit 1", [userId]);
        if (users.length < 0) {
            return res.json({ message: "El Usuario no existe" }, 200);
        }
        let user = users[0];

        const sucessValidate = validateUpdateUserFields(req.body);

        if (sucessValidate.success === false) {
            return res.json({ sucessValidate }, 200);
        }
        else {
            //Validacion de existencia del Usuario a traves del Correo
            const [rows] = await conn.query("select * from users where email = ? limit 1", [req.body.email]);
            const exist_user = rows[0];
            //Si no hay un usuario que devuelva un error
            if (exist_user != undefined) {

                if(exist_user.email != user.email)
                {
                    return res.json({ message: "Ya existe un usuario con este correo electronico" }, 200);
                }
            }

            console.log(user);

            user.name = req.body.name;
            user.document = req.body.document;
            user.email = req.body.email;
            user.address = req.body.address;
            user.phone = req.body.phone;

            console.log(user);
            
            const [results] = await conn.execute(
                "UPDATE users set name = ?,document = ?,email = ?,address = ?,phone = ? where id = ?",
                [
                    user.name,
                    user.document,
                    user.email,
                    user.address,
                    user.phone,
                    user.id
                ]
            );

            return res.json({
                message: "Usuario actualizado",
                user : user
            }, 200);
        }
    }
    catch (e) {
        console.log(e);
        return res.json({ message: "Ha ocurrido un error en el servidor" }, 500);
    }
}

//Eliminar usuario
export const destroy = async (req, res) => {
    try {

        let userId = req.params.id;
        const conn = await conect();
        //Validacion de existencia del Usuario a traves del Correo
        const [users] = await conn.query("select * from users where id = ? limit 1", [userId]);

        let user = users[0];
        let exceptEmail = null;//Correo que no debe encontrarse
        jwt.verify(req.token, process.env.JWT_SECRET, (error, authData) => {
            if (error) {
                return res.sendStatus(403);
            }
            else {
                exceptEmail = authData.email;
            }
        });

        //Si se trata de eliminar a si mismo lance un error, este sera para otro servicio
        if(exceptEmail == user.email)
        {
            return res.json({ message: "Ha ocurrido un error en el servidor" }, 500);
        }
        
        await conn.execute(
            "DELETE from users where id = ?",
            [
                user.id
            ]
        );
        

        if (users.length > 0) {
            return res.json({ message: "Usuario eliminado con exito"}, 200);
        }
        else {
            return res.json({ message: "El Usuario no existe" }, 200);
        }
    }
    catch (e) {
        console.log(e);
        return res.json({ message: "Ha ocurrido un error en el servidor" }, 500);
    }
}