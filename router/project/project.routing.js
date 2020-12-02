const express = require('express');
const ProjectModel = require('../../models/project/project.model');
const ProjectRoute = express.Router();

/* Get 全部 */
ProjectRoute.get('/api/projects', async (req, res, next) => {
  const { page, size } = req.query;
  await ProjectModel.find({})
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
ProjectRoute.get('/api/projects/:name', async (req, res, next) => {
  const error = {
    statusCode: 400,
    message: '查無資料',
  };
  // 搜尋是否存在
  await ProjectModel.findOne({ name: req.params.name })
    .then(data => data === null ? res.json(error) : res.json(data))
    .catch(e => {
      next(error)
      return
    })
});

/* Post */
ProjectRoute.post('/api/projects', express.json(), async (req, res, next) => {
  const error = {
    statusCode: 400,
    message: '此名稱已存在',
  };
  const { name, demoUrl, codeUrl, describe, purpose, backUrl, imgUrl, order } = req.body;
  // 搜尋是否重複
  const goal = await ProjectModel.findOne({ name: name })
  if (!goal) {
    await new ProjectModel({ name, demoUrl, codeUrl, describe, purpose, backUrl, imgUrl, order }).save()
      .then(data => res.json(req.body))
      .catch(err => next(err))
  } else {
    next(error);
    return;
  }
});

/* Put */
ProjectRoute.put('/api/projects/:name', express.json(), async (req, res, next) => {
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
  // 搜尋是否重複
  const updateGoal = await ProjectModel.findOne({ name: req.body.name });
  if (updateGoal && req.body.name !== req.params.name) {
    const error = {
      statusCode: 400,
      message: '名稱重複',
    };
    next(error);
    return;
  }
  req.body.updated = Date.now();
  // Try Validate
  await ProjectModel.updateOne({ name: req.params.name }, { $set: req.body })
    .then(() => res.json(req.body))
    .catch(err => next(err))
});

/* Delete */
ProjectRoute.delete('/api/projects/:name', async (req, res, next) => {
  const message = {
    message: '刪除成功',
    name: req.params.name,
  };
  const error = {
    statusCode: 400,
    message: '查無資料',
  };

  // 搜尋是否存在
  await ProjectModel.findOne({ name: req.params.name })
    .then(async (data) => {
      await ProjectModel.deleteOne({ name: req.params.name })
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

module.exports = ProjectRoute;
