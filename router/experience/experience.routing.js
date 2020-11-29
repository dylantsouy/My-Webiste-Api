const express = require('express');
const ExperienceModel = require('../../models/experience/experience.model');
const ExperienceRoute = express.Router();

/* Get 全部 */
ExperienceRoute.get('/api/experiences', async (req, res, next) => {
  const { page, size } = req.query;
  const data = await ExperienceModel.find({});
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
ExperienceRoute.get('/api/experiences/:company', async (req, res, next) => {
  // 搜尋是否存在
  const data = await ExperienceModel.findOne({ company: req.params.company });
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
ExperienceRoute.post(
  '/api/experiences',
  express.json(),
  async (req, res, next) => {
    // 搜尋是否重複
    const { company, position, date, imgUrl, task } = req.body;
    const goal = await ExperienceModel.findOne({ company: company });
    if (goal) {
      const error = {
        statusCode: 400,
        message: '此名字已存在',
      };
      next(error);
      return;
    }

    // Try Validate
    const exprience = new ExperienceModel({
      company,
      position,
      date,
      imgUrl,
      task,
    });
    try {
      await exprience.save();
      res.json(req.body);
    } catch (err) {
      next(err);
    }
  }
);

/* Put */
ExperienceRoute.put(
  '/api/experiences/:company',
  express.json(),
  async (req, res, next) => {
    // 搜尋是否存在
    const goal = await ExperienceModel.findOne({
      company: req.params.company,
    }).exec();
    if (!goal) {
      const error = {
        statusCode: 400,
        message: '查無資料',
      };
      next(error);
      return;
    }
    // 搜尋是否重複
    const updateGoal = await ExperienceModel.findOne({
      company: req.body.company,
    });
    if (updateGoal && req.body.company !== req.params.company) {
      const error = {
        statusCode: 400,
        message: '此名字已存在',
      };
      next(error);
      return;
    }
    // Try Validate
    await ExperienceModel.updateOne(
      { company: req.params.company },
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
ExperienceRoute.delete('/api/experiences/:company', async (req, res, next) => {
  // 搜尋是否存在
  const goal = await ExperienceModel.findOne({ company: req.params.company });
  if (!goal) {
    const error = {
      statusCode: 400,
      message: '查無資料',
    };
    next(error);
    return;
  }
  await ExperienceModel.deleteOne({ company: req.params.company });
  try {
    const message = {
      message: '刪除成功',
      company: req.params.company,
    };
    res.json(message);
  } catch (err) {
    next(err);
  }
});

module.exports = ExperienceRoute;
