import { json, Router } from "express";
import { Pergunta } from "../database/Pergunta.js";
import { tokenVerify } from "../middleware.js";
const pergunta = Router();

// public routes
pergunta.get("/", async (req, res) => {
    let { query="", page=1, qtd=10 } = req.query;
    let busca;

    try {

        if (query === "") {
            busca = await Pergunta.find();
            return res.status(200).json({ result: busca });
        }

        busca = await Pergunta.find({
            // 1º ordem: resultados a partir do titulo
            "titulo": {$in: query},
            // 2º ordem: resultados a partir do texto da pergunta
            "texto": {$in: query}
        });

        busca.slice(qtd);
        
        return res.status(200).json({ result: busca });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ result: {error: true, time: Date.now()} });
    }

});

pergunta.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {

        let result = await Pergunta.findById(id);

        return res.status(200).json({ result: result});

    } catch (error) {
        console.log(error);
        return res.status(400).json({ result: {error: error.message, time: Date.now()} });
    }
});

// private routes
pergunta.post("/", tokenVerify, async (req, res) => {
    const body = req.body;

    try {
        const novaPergunta = await Pergunta.create(body);
        return res.status(201).json({ result: novaPergunta });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ result: {error: error.message, time: Date.now()} });
    }

});

pergunta.delete("/:id", tokenVerify, async (req, res) => {
    const { id } = req.params;

    try {
        const removido = await Pergunta.deleteOne({ _id: id });
        return res.status(200).json({ result: removido });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ result: {error: true, time: Date.now()} });
    }
});

pergunta.put('/:id', tokenVerify, async (req, res) => {
    const perguntaId = req.params.id;
    const { titulo, texto, autor, pontos, date } = req.body;

    try {
        // Encontrar a pergunta pelo ID e atualizar
        const perguntaAtualizada = await Pergunta.findByIdAndUpdate(
            perguntaId,
            {
                titulo, 
                texto, 
                autor, 
                pontos, 
                date
            },
            { new: true, runValidators: true } // Retorna a pergunta atualizada
        );

        if (!perguntaAtualizada) {
            return res.status(400).json({ result: {error: error.message, time: Date.now()} });
        }

        return res.status(200).json({ result: perguntaAtualizada });
    } catch (error) {
        return res.status(400).json({ result: {error: error.message, time: Date.now()} });
    }
});

export { pergunta };