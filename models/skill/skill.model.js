const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    trim: true
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    required: true,
    trim: true
  },
  imgurl: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
});

const SkillModel = mongoose.model('Skill', SkillSchema);

module.exports = SkillModel;
