const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true,
    trim: true
  },
  imgUrl: {
    type: String,
    trim: true
  },
  task: {
    type: [String],
    required: true,
  },
  order:{
    type: String,
    required: true,
    trim: true
  }
});

const ExperienceModel = mongoose.model('Experience', ExperienceSchema);

module.exports = ExperienceModel;
