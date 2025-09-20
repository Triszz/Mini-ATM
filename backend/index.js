const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const accountRouter = require("./routes/account.route");
require("dotenv").config();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api", accountRouter);
const PORT = process.env.PORT;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB!");
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
