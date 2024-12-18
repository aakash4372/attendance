const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  dob: { type: Date },
  department: {
    type: String,
    enum: ["Frontend", "Backend", "UI/UX", "Digital Marketing"],
    required: true
  },
  password: { type: String, required: true }
});

module.exports = mongoose.model("User", userSchema);
