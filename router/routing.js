const SkillRoute = require('./skill/skill.routing');
const ProjectRoute = require('./project/project.routing');
const ExperienceRoute = require('./experience/experience.routing');
const express = require('express');

const Routing = express();

Routing.get('/', (req, res) => res.render('home'));

Routing.use('/', SkillRoute);
Routing.use('/', ProjectRoute);
Routing.use('/', ExperienceRoute);

Routing.use('*', (req, res) => res.send('404 <a href="/">GO Home</a>!'))

Routing.use((error, req, res, next) => {
  if (!error.statusCode) error.statusCode = 500;

  if (error.statusCode === 301) {
      return res.redirect(303, '/')
  }

  return res
      .status(error.statusCode)
      .json({ error });
});

module.exports = Routing