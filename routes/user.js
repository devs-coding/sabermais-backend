import { Router } from "express";
import { User } from "../database/User.js";
const user = Router();

user.post("/sigin", async (req, res) => {
    const novo = req.body;

    try {
        const novoUser = await User.create(novo);
        return res.status(201).json({result: novoUser});
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: "error, talvez a falta de dados" })
    }
})

export { user };