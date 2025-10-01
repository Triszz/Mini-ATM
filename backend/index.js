const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const accountRouter = require("./routes/account.route");
require("dotenv").config();

const corsOptions = {
  origin: ["http://localhost:5173", "https://mini-atm-r9hy.onrender.com/"],
  credentials: true,
  optionsSuccessStatus: 200,
};
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

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
