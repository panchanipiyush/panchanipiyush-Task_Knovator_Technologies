const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 8000;

mongoose.connect(DB_URL).then(() => {
    console.log("DataBase Connected");
})

const passport = require("passport")
app.use(passport.initialize());

app.use(express.json());

app.use("/",require("../router/router"))

app.listen(PORT, () => {
    console.log("Server running on PORT:" + PORT);
})

