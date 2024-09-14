import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const tokenVerify = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) 
        return res.status(400).json({result: "Sem autenticação"});

    // O header pode estar no formato "Bearer <token>"
    const token = authHeader.split(' ')[1]; // Pegando o token após "Bearer"

    if (!token)
        return res.status(400).json({result: "Sem token"});
    
    jwt.verify(token, process.env.SECRET, (err, id) => {
        if (!err)
            next();
        else 
            return res.status(400).json({result: "token invalido"});
    });
}