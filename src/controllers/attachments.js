import { Console } from "console";
import { conect } from "../database";
var fs = require("fs")


export const saveAttachment = async (req, res) => {

    console.log('La cantidad de archivos que llegan es: ', req.files.file.length)
    for (let i = 0; i < req.files.file.length; i++) {
        try {
            //Valida la conexion a la base de datos
            const conn = await conect();

            console.log(req.files.file[i].path);

            const Attachment =
            {
                file: ('http://localhost:5000/uploads/' + req.files.file[i].filename),
                originalname: req.files.file[i].originalname,
                task_id: req.body.text
            }
            console.log(Attachment);

            // GUARDADDO DE LOS ADJUNTOS
            const [results] = await conn.execute(
                "INSERT INTO attachments (file,originalname,tasks_id) VALUES (?,?,?)",
                [
                    Attachment.file,
                    Attachment.originalname,
                    Attachment.task_id,
                ])

            return res.status(200).json(Attachment)

        }
        catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Ha ocurrido un error con el servidor" });
        }
    }
};


export const getAttachments = async (req, res) => {
    try{
        const conn = await conect();

        const [results] = await conn.execute("SELECT * FROM attachments")

        return res.status(200).json(results);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Ha ocurrido un error con el servidor" });
    }
}

export const deleteAttachments = async (req, res) => {
    try{
        const conn = await conect();
        console.log('delete: esto llega', req.body)

        const [results] = await conn.execute("DELETE FROM attachments WHERE id= ?", [req.body.id])

        return res.status(200).json({message: 'Archivo eliminado con éxito'});
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Ha ocurrido un error con el servidor" });
    }
}