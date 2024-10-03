import { connect } from "mongoose";
import express, { json } from "express";
import { config } from "dotenv";
import { user } from "./routes/user.js";
import { pergunta } from "./routes/pergunta.js";
config();

const app = express();
app.use(json());

app.get("/", (req, res) => {
    return res.json({ msg: "funcionando" })
});

app.use("/user", user);
app.use("/pergunta", pergunta);

// conexão banco de dados
const URL_DB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ho8q2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
connect(URL_DB)
    .then(() => console.log("Banco de dados conected!!"))
    .catch(() => console.log("db failed"));

// porta da aplicação
const PORT = 8080;
app.listen(
    PORT,
    () => console.log("App listen in port: " + PORT)
);