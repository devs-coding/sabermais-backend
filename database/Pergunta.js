import { model, Schema, Types } from "mongoose";
import { respostaSchema } from "./Resposta.js";

const perguntaSchema = new Schema({
    titulo: {
        type: String,
        required: [true, "Deve conter titulo"]
    },
    texto: String,
    autor: {
        type: Types.ObjectId,
        required: [true, "é necessário um autor"]
    },
    pontos: Number,
    respostas: [ respostaSchema ],
    date: Date
});

perguntaSchema.pre("save", function () {
    this.date = Date.now();
})

const Pergunta = model("Pergunta", perguntaSchema);

export { Pergunta };