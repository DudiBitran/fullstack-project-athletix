const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const upload = require("./middleware/upload");
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
app.use("/athletix/users", require("./routes/user/userRoutes"));
app.use("/athletix/auth", require("./routes/auth/authRoutes"));
app.use("/athletix/users/admin", require("./routes/admin/adminUserRoutes"));
app.use(
  "/athletix/users/trainers",
  require("./routes/trainer/trainerUserRoutes")
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

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
