const mongoose = require("mongoose");
const { Program } = require("../model/program");

async function checkProgramOwnership(req, res, next) {
  const programId = req.params.id;
  const user = req.user;

  // ✅ בדיקת תקינות מזהה
  if (!mongoose.Types.ObjectId.isValid(programId)) {
    return res.status(400).send("Invalid program ID.");
  }

  try {
    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).send("Program not found.");
    }

    if (user.role === "admin") {
      req.program = program;
      return next();
    }

    if (user.role !== "trainer") {
      return res.status(403).send("Access denied.");
    }

    if (!program.trainer.equals(user._id)) {
      return res.status(403).send("You do not own this program.");
    }

    req.program = program;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = checkProgramOwnership;
