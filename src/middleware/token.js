import jwt from 'jsonwebtoken';

//Validacion de existencia del Token
export const ensureToken = function (req,res,next){
    const bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== "undefined")
    {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else
    {
        res.sendStatus(403);//No autorizado
        next();
    }
};

export const verifyToken = function(req,res,next)
{
    jwt.verify(req.token,process.env.JWT_SECRET,(error,authData)=> {
        if(error)
        {
            res.sendStatus(403);
        }
        else
        {
            next();
        }
    });
}