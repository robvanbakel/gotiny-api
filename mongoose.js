const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB);

const goTinySchema = new mongoose.Schema({
  long: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  customCode: {
    type: Boolean,
    required: false,
  },
  lastActive: {
    type: Number,
    required: false,
  },
  createdAt: {
    type: Number,
    required: true,
  },
  visited: {
    type: Number,
    required: true,
  },
}, { versionKey: false });

const GoTiny = mongoose.model('GoTiny', goTinySchema, 'gotiny');

module.exports = GoTiny;
