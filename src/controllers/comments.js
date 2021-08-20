import { conect } from "../database";


export const saveComment = async (req, res) => {
    console.log(req.body)
    try {
        //Valida la conexion a la base de datos
        const conn = await conect();

        const sucessValidate = validateAllTaskFields(req.body);

        if (sucessValidate.success === false) {
            res.json({ sucessValidate }, 200);
        }
        else {
            //Guardado de la tarea
            const task =
            {
                user_id: req.body.user
            }

            const [results] = await conn.execute(
                "INSERT INTO tasks(project,subject,start_date,end_date,description,priority_id,status_id,users_id) VALUES (?,?,?,?,?,?,?,?)",
                [
                    task.project,
                    task.subject,
                    task.start_date,
                    task.end_date,
                    task.description,
                    task.priority_id,
                    task.status_id,
                    task.user_id
                ]/*,
                (error, result, fields) => {console.log(error), console.log(result),console.log(fields)} 
            */)

            res.json({
                message: "Registro exitoso",
                task: task
            }, 200)
        }
    }

    catch (e) {
        console.log(e);
        res.json({ message: "Ha ocurrido un error en el servidor" }, 500);
    }
};


// REALIZA LA BUSQUEDA DE TODAS LAS TAREAS QUE HAYAN EN LA BASE DE DATOS
export const getTasks = async (req, res) => {

    const conn = await conect();
    const [response] = await conn.query("select * from tasks");
    const tasks = response;
    res.json({
        message: "Búsqueda exitosa",
        tasks: tasks
    });
}