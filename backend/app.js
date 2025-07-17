const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

morgan.token("time", () => {
  return new Date().toLocaleTimeString();
});
const format = "[:time] :method :url :status :response-time ms";
const PORT = 3000;
const DB_NAME = "AthletiX";

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 500, // up to 100 requests in 15 mins
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan(format));

//rate-limit
app.use("/athletix", generalLimiter);

app.use("/athletix/users", require("./routes/user/userRoutes"));
app.use("/athletix/auth", require("./routes/auth/authRoutes"));
app.use("/athletix/users/admin", require("./routes/admin/adminUserRoutes"));
app.use(
  "/athletix/users/trainers",
  require("./routes/trainer/trainerUserRoutes")
);
app.use(
  "/athletix/users/trainers",
  require("./routes/trainer/trainerAssignRoute")
);
app.use("/athletix/program", require("./routes/program/programRoute"));
app.use("/athletix/program", require("./routes/program/assignProgramRoute"));
app.use(
  "/athletix/admin/program",
  require("./routes/admin/adminProgramRoutes")
);
app.use("/athletix/exercise/", require("./routes/exercise/exerciseRoute"));
app.use(
  "/athletix/workout-status/",
  require("./routes/workoutStatus/workoutStatusRoutes")
);
app.use("/athletix/analytics/", require("./routes/analytics/analytics"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/file-upload", express.static(path.join(__dirname, "file-upload")));
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

mongoose
  .connect(process.env.MONGO_ATLAS_URI)
  .then(() => {
    console.log(`Connected to ${DB_NAME} DB`);
    app.listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error:", err);
  });
