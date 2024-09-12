import { model, Schema } from "mongoose";

const userSchema = new Schema({
    nome: {
        type: String,
        required: [true, "O nome é obrigatório"]
    },
    curso: String,
    pontos: Number,
    urlImg: String
});

const User = model("User", userSchema);

export { User };