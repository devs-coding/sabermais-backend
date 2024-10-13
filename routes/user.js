import { Router } from "express";
import { User } from "../database/User.js";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { tokenVerify } from "../middleware.js";
import { Pergunta } from "../database/Pergunta.js";
import { respostaSchema } from "../database/Resposta.js";
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

user.put("/", tokenVerify, async (req, res) => {
    const {
        nome,
        curso,
        urlImg
    } = req.body;

    try {

        await User.findByIdAndUpdate(
            req.header.id,
            {
                nome,
                curso,
                urlImg
            }
        );

        const me = await User.findById(req.header.id);

        return res.status(200).json({ result: me });
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "não foi possível atualizar seus dados" });
    }
});

user.delete("/", tokenVerify, async (req, res) => {
    
    try {
        await User.findByIdAndDelete(req.header.id);

        const user = await User.findById(req.header.id);
        if (!user);
            return res.status(200).json({ result: "usuário removido" });
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "não foi possível remover usuário" });
    }

});

// EM ANDAMENTO
user.get("/contribuicoes", tokenVerify, async (req, res) => {
    const idUser = req.header.id;
    const contribuicoes = {};

    try {
        contribuicoes.qtdPerguntas = await Pergunta.find({autor: idUser}).countDocuments();

        contribuicoes.qtdRespostas = await Pergunta.find({
            "respostas.autor": idUser
        }).countDocuments();
    
        return res.status(200).json({ result: contribuicoes });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "error ao buscar contribuições" });
    }
})

export { user };