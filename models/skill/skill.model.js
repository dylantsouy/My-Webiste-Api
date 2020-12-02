const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    trim: true
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
  imgUrl: {
    type: Buffer,
    required: true,
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  order:{
    type: Number,
    required: true,
    trim: true
  },
  updated: {
    type: Date,
    default: Date.now,
  }
});

const SkillModel = mongoose.model('Skill', SkillSchema);

module.exports = SkillModel;
