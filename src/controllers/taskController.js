import { conect } from "../database";
import bcrypt from "bcryptjs";
import { transporter } from '../mailer';

// VALIDA QUE LOS CAMPOS OBLIGATORIOS ESTÉN LLENOS
const validateAllTaskFields = (request) => {
    const successStatus =
    {
        success: true,
        messages: [
            ''
        ]
    };
    if (request.user == undefined) {
        successStatus.success = false;
        successStatus.messages.push("El responsable es requerido");
    }
    if (request.project == undefined) {
        successStatus.success = false;
        successStatus.messages.push("El nombre del proyecto es requerido");
    }
    if (request.subject == undefined) {
        successStatus.success = false;
        successStatus.messages.push("El asunto es requerido");
    }
    if (request.start_date == undefined) {
        successStatus.success = false;
        successStatus.messages.push("La fecha inicial es requerida");
    }
    if (request.end_date == undefined) {
        successStatus.success = false;
        successStatus.messages.push("La fecha final es requerida");
    }
    if (request.priority == undefined) {
        successStatus.success = false;
        successStatus.messages.push("La prioridad es requerida");
    }
    if (request.status == undefined) {
        successStatus.success = false;
        successStatus.messages.push("El estado es requerido");
    }
    return successStatus;
}


// GUARDAR LA TAREA
export const storeTask = async (req, res) => {
    console.log(req.body)
    try {
        //Valida la conexion a la base de datos
        const conn = await conect();

        const sucessValidate = validateAllTaskFields(req.body);

        if (sucessValidate.success === false) {
            return res.json({ sucessValidate }, 200);
        }
        else {
            //Guardado de la tarea
            const task =
            {
                project: req.body.project,
                subject: req.body.subject,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                description: req.body.description,
                priority_id: req.body.priority,
                status_id: req.body.status,
                user_id: req.body.user,
                created_by: req.body.created_by
            }

            const [results] = await conn.execute(
                "INSERT INTO tasks(project,subject,start_date,end_date,description,priority_id,status_id,users_id,created_by) VALUES (?,?,?,?,?,?,?,?,?)",
                [
                    task.project,
                    task.subject,
                    task.start_date,
                    task.end_date,
                    task.description,
                    task.priority_id,
                    task.status_id,
                    task.user_id,
                    task.created_by
                ])

            const [usuario] = await conn.execute(
                "SELECT * FROM users WHERE id= ?", [task.user_id]
            )

            transporter.sendMail({
                from: '"Ingenioitc" <devesteban44@gmail.com>', // sender address
                to: usuario[0].email, // list of receivers
                subject: "Tarea asignada", // Subject line
                text: 'Se le ha asignado una tarea correspondiente al proyecto: ' + task.project + '. \n\nFecha de entrega: ' + task.end_date + '\n\n' + 'Descripción: \n' + task.description // plain text body
            });

            return res.json({
                message: "Registro exitoso",
                task: task
            }, 200)
        }
    }

    catch (e) {
        console.log(e);
        return res.json({ message: "Ha ocurrido un error en el servidor" }, 500);
    }
};


// REALIZA LA BUSQUEDA DE TODAS LAS TAREAS QUE HAYAN EN LA BASE DE DATOS
export const getTasks = async (req, res) => {

    try {
        const id = req.params.id;
        const conn = await conect();

        const [response] = await conn.query("SELECT * FROM tasks WHERE users_id = ? OR created_by = ?", [id, id]);
        const tasks = response;
        res.status(200).json(tasks)
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Ha ocurrido un error en el servidor" });
    }
}


export const deleteTasks = async (req, res) => {

    const conn = await conect();

    const [response] = await conn.query("delete from tasks where id=?", req.body.id);
    console.log(response[0])

    res.json({
        message: "Eliminado con éxito",
    });
}

// REALIZA LA BUSQUEDA DE UNA TAREA EN ESPECIFICO
export const getTask = async (req, res) => {
    try {
        //Valida la conexion a la base de datos
        const conn = await conect();


        const [response] = await conn.query("select * from tasks where id = ?", [req.body.id]);
        const task = response[0];
        console.log(task)
        return res.json({
            message: "Búsqueda exitosa",
            task: task
        });
    }
    catch (e) {
        console.log(e);
        return res.json({ message: "Ha ocurrido un error en el servidor" }, 500);
    }
}

export const updateTask = async (req, res) => {
    try {
        //Valida la conexion a la base de datos
        const conn = await conect();

        const sucessValidate = validateAllTaskFields(req.body);

        if (sucessValidate.success === false) {
            res.json({ sucessValidate }, 200);
        }
        else {
            //Actualizado de la tarea
            const task =
            {
                id: req.body.id,
                project: req.body.project,
                subject: req.body.subject,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                description: req.body.description,
                priority_id: req.body.priority,
                status_id: req.body.status,
                user_id: req.body.user
            }

            const [results] = await conn.execute(
                "UPDATE tasks set project = ?,subject = ?,start_date = ?,end_date = ?,description = ?,priority_id = ?,status_id = ?,users_id = ? where id = ?",
                [
                    task.project,
                    task.subject,
                    task.start_date,
                    task.end_date,
                    task.description,
                    task.priority_id,
                    task.status_id,
                    task.user_id,
                    task.id
                ])

            res.status(200).json({
                message: "Actualizacion exitosa",
                task: task
            })
        }
    }

    catch (e) {
        console.log(e);
        res.json({ message: "Ha ocurrido un error en el servidor" }, 500);
    }
};


export const changeStatusTask = async (req, res) => {
    console.log(req.body)
    try {
        //Valida la conexion a la base de datos
        const conn = await conect();


        //Cambiando el estado 
        const task =
        {
            id: req.body.id,
            status_id: req.body.status
        }

        const [results] = await conn.execute(
            "UPDATE tasks set status_id = ? where id = ?",
            [
                task.status_id,
                task.id
            ])

        res.json({
            message: "Actualizacion de status exitosa",
            task: task
        }, 200)
    }

    catch (e) {
        console.log(e);
        res.json({ message: "Ha ocurrido un error en el servidor" }, 500);
    }
};
