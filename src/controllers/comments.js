import { conect } from "../database";


export const saveComment = (req, res) => {

    try {
        const conn = await conect();

        const [results] = await conn.execute('INSERT INTO task_comments (task_id, users_id, comment)')

    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Ha ocurrido un error en el servidor' })
    }
}