const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  demoUrl: {
    type: String,
    required: true,
    trim: true
  },
  codeUrl: {
    type: String,
    required: true,
    trim: true
  },
  imgUrl: {
    type: String,
    required: true,
    trim: true
  },
  describe: {
    type: String,
    required: true,
    trim: true
  },
  purpose: {
    type: String,
    required: true,
    trim: true
  },
  backUrl:{
    type: String,
    trim: true
  },
  order:{
    type: Number,
    required: true,
    trim: true
  }
});

const ProjectModel = mongoose.model('Project', ProjectSchema);

module.exports = ProjectModel;
