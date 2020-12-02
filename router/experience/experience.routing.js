const express = require('express');
const ExperienceModel = require('../../models/experience/experience.model');
const ExperienceRoute = express.Router();

/* Get 全部 */
ExperienceRoute.get('/api/experiences', async (req, res, next) => {
  const { page, size } = req.query;
  await ExperienceModel.find({})
    .then(data => {
      const dataLength = data.length;
      // 分頁
      let pageData = [];
      page && size ? (pageData = data.splice(size * (page - 1), size)) : (pageData = data);
      // 排序 order
      pageData.sort((a, b) => {
        const oderA = a.order;
        const oderB = b.order;
        if (oderA < oderB) return -1;
        if (oderA > oderB) return 1;
        return 0;
      });
      res.set('totalSize', dataLength);
      res.json(pageData);
    })
    .catch(err => {
      next(err)
      return
    })
});

/* Get 特定目標 */
ExperienceRoute.get('/api/experiences/:company', async (req, res, next) => {
  const error = {
    statusCode: 400,
    message: '查無資料',
  };
  // 搜尋是否存在
  await ExperienceModel.findOne({ company: req.params.company })
    .then(data => data === null ? res.json(error) : res.json(data))
    .catch(e => {
      next(error)
      return
    })
});

/* Post */
ExperienceRoute.post('/api/experiences', express.json(), async (req, res, next) => {
  const error = {
    statusCode: 400,
    message: '此經歷已存在',
  };
  const { company, position, date, imgUrl, task, order } = req.body;
  // 搜尋是否重複
  const goal = await ExperienceModel.findOne({ company: company })
  if (!goal) {
    await new ExperienceModel({ company, position, date, imgUrl, task, order }).save()
      .then(data => res.json(req.body))
      .catch(err => next(err))
  } else {
    next(error);
    return;
  }
});

/* Put */
ExperienceRoute.put('/api/experiences/:company', express.json(), async (req, res, next) => {
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
  // 搜尋是否重複
  const updateGoal = await ExperienceModel.findOne({ company: req.body.company });
  if (updateGoal && req.body.company !== req.params.company) {
    const error = {
      statusCode: 400,
      message: '經歷重複',
    };
    next(error);
    return;
  }
  req.body.updated = Date.now();
  // Try Validate
  await ExperienceModel.updateOne({ company: req.params.company }, { $set: req.body })
    .then(() => res.json(req.body))
    .catch(err => next(err))
});

/* Delete */
ExperienceRoute.delete('/api/experiences/:company', async (req, res, next) => {
  const message = {
    message: '刪除成功',
    company: req.params.company,
  };
  const error = {
    statusCode: 400,
    message: '查無資料',
  };

  // 搜尋是否存在
  await ExperienceModel.findOne({ company: req.params.company })
    .then(async (data) => {
      await ExperienceModel.deleteOne({ company: req.params.company })
        .then(data => data.deletedCount === 0 ? next(error) : res.json(message))
        .catch(err => {
          next(err)
          return
        })
    })
    .catch(e => {
      next(error)
      return
    });
});

module.exports = ExperienceRoute;
