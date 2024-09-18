import { hash } from "bcrypt";
import { model, Schema } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "O email é obrigatório"]
    },
    senha: {
        type: String,
        required: [true, "A senha é obrigatório"]
    },
    nome: {
        type: String,
        required: [true, "O nome é obrigatório"]
    },
    curso: String,
    pontos: Number,
    urlImg: String
});

userSchema.pre("save", async function (next) {
    
    if (this.isModified("senha")) {
        this.senha = await hash(this.senha, 10);
    }

    next();
});

const User = model("User", userSchema);

export { User };