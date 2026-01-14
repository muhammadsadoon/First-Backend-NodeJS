# Just make the CURD Operations

> [!WARNING]
> This Code is only temporary porpose to storing data in <a href="./data/db.json">`JSON`</a>

## Class 1: CODE(Server.js)

```js
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
// for testing purpose if API is properly!
app.get("/", (_, res) => {
    res.send("API is working");
})

// get all users...
app.get("/users", (req, res) => {
    res.status(200).send(db)
})

// add user by /add (PORT Request)
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

// delete user by /del/:uid (DELETE Request)
app.delete("/del/:uid", (req, res) => {
    const { uid } = req.params;
    const isUserExist = db.find((item) => item.id === Number(uid));
    if (!isUserExist) {
        return res.status(404).json({
            status: false,
            message: "user are not found"
        })
    }

    db.splice(isUserExist, 1)

    fs.writeFile("./data/db.json",JSON.stringify(db))
    return res.status(200).json({
        status: true,
        message: "User are deleted!"
    })
})

// app listening
app.listen(port, () => console.log(`Server running in http://localhost:${port}`))
```

## Class 2: CODE(Server.js)

```js
    import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";
import mongoose from "mongoose";

// .env file configration...
config({
    path: "./.env"
});

// mongodb connection configration defined here...
mongoose.connect(process.env.MONGO_DB_URL, { dbName: "user_db" })
    .then(() => console.log("Mongodb Connected"))
    .catch((err) => console.log("Mongodb Err while connecting: ", err));

// mongodb schema defined here...
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: "Intern"
    }
}, {
    collection: "user_collection"
});

// create user Mongodb Model here...
const UserModal = mongoose.model("user", userSchema)

// define global envoriment Veriable here...
const app = express();
const port = process.env.PORT;

// app middlewares...
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }))

// API defind here...
// for testing purpose if API is properly!
app.get("/", (req, res) => {
    res.send("API is working");
})

app.get("/fetch/users/all",(req,res)=>{
    return res.send({
        status: true
    })
})

// add user by /add (PORT Request)
app.post("/add", async (req, res) => {
    try {
        // 400:
        const bodyValues = Object.values(req.body);
        const isValidate = bodyValues?.some((item) => {
            return item == "";
        });

        if (isValidate) {
            return res.status(400).send({
                status: false,
                message: "All fields are required",
            });
        }

        // 200:
        const newUser = new UserModal(req.body);
        const saveUser = await newUser.save();

        if (saveUser) {
            return res.status(200).send({
                status: true,
                message: "User saved successfully",
                data: newUser,
            });
        }
    } catch (error) {
        // 500:
        console.log("Err from server side: ", error.errmsg);

        return res.status(500).send({
            status: false,
            message: "Err from server side",
            serverErrMsg: error,
        });
    }
})



// app listening
app.listen(port, () => console.log(`Server running in http://localhost:${port}`))
```
