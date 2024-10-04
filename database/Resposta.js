import { Schema, Types } from "mongoose";

const comentarioSchema = new Schema({
    autor: {
        type: Types.ObjectId,
        required: [true, "É necessário um autor para o comentario"]
    },
    date: Date,
    texto: {
        type: String,
        required: [true, "Comentário sem texto"]
    },
    curtida: Number
});

const respostaSchema = new Schema({
    resposta: {
        type: String,
        required: [true, "Deve conter titulo"]
    },
    explicacao: String,
    autor: {
        type: Types.ObjectId,
        required: [true, "é necessário um autor"]
    },
    comentarios: [ comentarioSchema ],
    date: Date
});

respostaSchema.pre("save", function () {
    this.date = Date.now();
})

comentarioSchema.pre("save", function () {
    this.date = Date.now();
})


export { respostaSchema };