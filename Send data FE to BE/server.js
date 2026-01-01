import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";
import fs from "fs/promises";
import db from "./data/db.json" with {type: "json"};

// .env file configration...
config({
    path: "./.env"
});

// define global envoriment Veriable here...
const app = express();
const port = process.env.PORT;

// app middlewares...
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }))

// API defind here...
app.get("/", (_, res) => {
    res.send("API is working");
})

app.get("/users", (req, res) => {
    res.status(200).send(db)
})

app.post("/add", (req, res) => {
    const data = req.body;
    const obj = {
        ...data,
        id: db.length
    }
    try {
        if (data.name && data.role) {
            if (!db.some((item) => item.name === req.body.name)) {
                db.push(obj);
                fs.writeFile("./data/db.json", JSON.stringify(db), () => console.log("data was added"))
                return res.send(data);
            } else {
                return res.status(403).send({
                    status: false,
                    message: "This name is already existed!"
                });
            }
        } else {
            throw new Error("the input fields are not filled")
        }

    } catch (err) {
        return res.status(400).send({
            status: false,
            message: "Please fill the all input fields"
        })
    }
})


// app listening
app.listen(port, () => console.log(`Server running in http://localhost:${port}`))