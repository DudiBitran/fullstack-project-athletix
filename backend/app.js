const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

morgan.token("time", () => {
  return new Date().toLocaleTimeString();
});
const format = "[:time] :method :url :status :response-time ms";
const PORT = 3000;

const app = express();
app.use(cors());
app.use(morgan(format));
app.use(express.json());
app.use("/athletix/users", require("./routes/userRoutes"));
app.use("/athletix/auth", require("./routes/authRoutes"));
app.use("/athletix/users/admin", require("./routes/adminUserRoutes"));

mongoose
  .connect(process.env.MONGO_ATLAS_URI)
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error:", err);
  });
