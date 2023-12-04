const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://soluian:3oJ7zMyE7fJg0kbZ@cluster0.gc1oqes.mongodb.net/Main?retryWrites=true&w=majority";

  mongoose
  .connect(connectionString)
  .then(() => {
    console.log("connected to Mongo");

    const app = express();
    app.listen(3000, async () => {
      console.log("Server is running");
    });

    app.use(express.json());
    app.use(cors());

    const barCodeRouter = require("./controllers/barCode.controller");
    app.use(barCodeRouter);
  });
