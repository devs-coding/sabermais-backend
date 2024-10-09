import { Router } from "express";
import { User } from "../database/User.js";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { tokenVerify } from "../middleware.js";
const user = Router();

user.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await User.findOne({email: email});
        if (!user) return res.status(400).json({result: "e-mail não cadastrado"});

        const isMatch = await compare(senha, user.senha);
        if (!isMatch) 
            return res.status(400).json({result: "e-mail ou senha incorretos"});

        const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: 300 });
        return res.status(200).json({result: {token: token, expiresIn: 300}});
    } catch (error) {
        console.log(error);
        return res.status(400).json({result: {error: true, time: Date.now()}});
    }
});

user.post("/sigin", async (req, res) => {
    const body = req.body;

    try {
        let emailExists = await User.findOne({email: body.email});
        if (emailExists)
            return res.status(400).json({ result: "E-mail já em uso" });

        const novoUser = await User.create(body);
        return res.status(201).json({ result: novoUser });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ result: {error: true, time: Date.now()} });
    }
});

// rotas privatas abaixo

user.get("/", tokenVerify, async (req, res) => {

    try {
        const dataMyAccount = await User.findOne({ _id: req.header.id });
        return res.status(200).json({ result: dataMyAccount });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ result: {error: true, time: Date.now()} });
    }
    
})

/**
 * Criar uma pergunta (ROTA)
 * header: {
 *  authentication: token
 * }
 * body:
 *  pergunta: 
 *      titulo,
 *      pontos,
 *      respostas,
 *      
 */

export { user };