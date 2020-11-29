const express = require('express');
const SkillModel = require('../../models/skill/skill.model');
const SkillRoute = express.Router();

/* Get 全部 */
SkillRoute.get('/api/skills', async (req, res, next) => {
  const { page, size } = req.query;
  const data = await SkillModel.find({});
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
SkillRoute.get('/api/skills/:key', async (req, res, next) => {
  // 搜尋是否存在
  const data = await SkillModel.findOne({ key: req.params.key });
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
SkillRoute.post('/api/skills', express.json(), async (req, res, next) => {
  // 搜尋是否重複
  const { key, name, level, type, imgurl } = req.body;
  const goal = await SkillModel.findOne({ key: key });
  if (goal) {
    const error = {
      statusCode: 400,
      message: '此名字已存在',
    };
    next(error);
    return;
  }
  // Try Validate
  const skill = new SkillModel({ key, name, level, type, imgurl });
  try {
    await skill.save();
    res.json(req.body);
  } catch (err) {
    next(err);
  }
});

/* Put */
SkillRoute.put('/api/skills/:key', express.json(), async (req, res, next) => {
  // 搜尋是否存在
  const goal = await SkillModel.findOne({ key: req.params.key }).exec();
  if (!goal) {
    const error = {
      statusCode: 400,
      message: '查無資料',
    };
    next(error);
    return;
  }
  // 搜尋是否重複
  const updateGoal = await SkillModel.findOne({ key: req.body.key });
  if (updateGoal && req.body.key !== req.params.key) {
    const error = {
      statusCode: 400,
      message: '此名字已存在',
    };
    next(error);
    return;
  }
  // Try Validate
  await SkillModel.updateOne({ key: req.params.key }, req.body, (err, raw) => {
    if (err) {
      next(err);
      return;
    }
    res.json(raw);
  });
});

/* Delete */
SkillRoute.delete('/api/skills/:key', async (req, res, next) => {
  // 搜尋是否存在
  const goal = await SkillModel.findOne({ key: req.params.key });
  if (!goal) {
    const error = {
      statusCode: 400,
      message: '查無資料',
    };
    next(error);
    return;
  }
  await SkillModel.deleteOne({ key: req.params.key });
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

module.exports = SkillRoute;
