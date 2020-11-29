const express = require('express');
const ProjectModel = require('../../models/project/project.model');
const ProjectRoute = express.Router();

/* Get 全部 */
ProjectRoute.get('/api/projects', async (req, res, next) => {
  const { page, size } = req.query;
  const data = await ProjectModel.find({});
  const dataLength = data.length;
  let pageData = [];
  page && size
    ? (pageData = data.splice(size * (page - 1), size))
    : (pageData = data);
  try {
    res.set('totalSize', dataLength);
    res.json(pageData);
  } catch (err) {
    next(err);
  }
});

/* Get 特定目標 */
ProjectRoute.get('/api/projects/:name', async (req, res, next) => {
  // 搜尋是否存在
  const data = await ProjectModel.findOne({ name: req.params.name });
  if (!data) {
    const error = {
      statusCode: 400,
      message: '查無資料',
    };
    next(error);
    return;
  }
  try {
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/* Post */
ProjectRoute.post('/api/projects', express.json(), async (req, res, next) => {
  // 搜尋是否重複
  const {
    name,
    demoUrl,
    imgUrl,
    codeUrl,
    describe,
    purpose,
    backUrl,
  } = req.body;
  const goal = await ProjectModel.findOne({ name: name });
  if (goal) {
    const error = {
      statusCode: 400,
      message: '此名字已存在',
    };
    next(error);
    return;
  }
  // Try Validate
  const project = new ProjectModel({
    name,
    demoUrl,
    imgUrl,
    codeUrl,
    describe,
    purpose,
    backUrl,
  });
  try {
    await project.save();
    res.json(req.body);
  } catch (err) {
    next(err);
  }
});

/* Put */
ProjectRoute.put(
  '/api/projects/:name',
  express.json(),
  async (req, res, next) => {
    // 搜尋是否存在
    const goal = await ProjectModel.findOne({ name: req.params.name }).exec();
    if (!goal) {
      const error = {
        statusCode: 400,
        message: '查無資料',
      };
      next(error);
      return;
    }
    // 搜尋是否重複
    const updateGoal = await ProjectModel.findOne({ name: req.body.name });
    if (updateGoal && req.body.name !== req.params.name) {
      const error = {
        statusCode: 400,
        message: '此名字已存在',
      };
      next(error);
      return;
    }
    // Try Validate
    await ProjectModel.updateOne(
      { name: req.params.name },
      { $set: req.body },
      (err, raw) => {
        if (err) {
          next(err);
          return;
        }
        res.json(raw);
      }
    );
  }
);

/* Delete */
ProjectRoute.delete('/api/projects/:name', async (req, res, next) => {
  // 搜尋是否存在
  const goal = await ProjectModel.findOne({ name: req.params.name });
  if (!goal) {
    const error = {
      statusCode: 400,
      message: '查無資料',
    };
    next(error);
    return;
  }
  await ProjectModel.deleteOne({ name: req.params.name });
  try {
    const message = {
      message: '刪除成功',
      name: req.params.name,
    };
    res.json(message);
  } catch (err) {
    next(err);
  }
});

module.exports = ProjectRoute;
