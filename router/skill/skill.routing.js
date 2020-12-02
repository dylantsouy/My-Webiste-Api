const express = require('express');
const SkillModel = require('../../models/skill/skill.model');
const sharp = require('sharp')
const SkillRoute = express.Router();

/* multer */
const multer = require('multer');
const upload = multer({
  limit: {
    // 限制上傳檔案的大小為 1MB
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    // 只接受三種圖片格式
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('請上傳圖片檔'))
    }
    cb(null, true)
  }
})

/* Get 全部 */
SkillRoute.get('/api/skills', async (req, res, next) => {
  const { page, size } = req.query;
  await SkillModel.find({})
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
SkillRoute.get('/api/skills/:key', async (req, res, next) => {
  const error = {
    statusCode: 400,
    message: '查無資料',
  };
  // 搜尋是否存在
  await SkillModel.findOne({ key: req.params.key })
    .then(data => data === null ? res.json(error) : res.json(data))
    .catch(e => {
      next(error)
      return
    })
});

/* Post */
SkillRoute.post('/api/skills', express.json(), upload.single('imgUrl'), async (req, res, next) => {
  const error = {
    statusCode: 400,
    message: '此技能已存在',
  };
  const { key, name, level, type, order } = req.body;
  // 搜尋是否重複
  const goal = await SkillModel.findOne({ key: key })
  if (!goal) {
    // get binary
    if (req.file) {
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 160, height: 160 })
        .png()
        .toBuffer()
      req.body.imgUrl = buffer
    }
    const { imgUrl } = req.body;
    await new SkillModel({ key, name, level, type, imgUrl, order }).save()
      .then(data => res.json(req.body))
      .catch(err => {
        next(err)
        return
      })
  } else {
    next(error);
    return
  }
});

/* Put */
SkillRoute.put('/api/skills/:key', express.json(), upload.single('imgUrl'), async (req, res, next) => {
  // 搜尋是否存在 // 搜尋是否存在
  const goal = await SkillModel.findOne({ key: req.params.key });
  if (!goal) {
    const error = {
      statusCode: 400,
      message: '查無資料',
    };
    next(error);
    return
  }
  // 搜尋是否重複
  const updateGoal = await SkillModel.findOne({ key: req.body.key });
  if (updateGoal && req.body.key !== req.params.key) {
    const error = {
      statusCode: 400,
      message: '技能重複',
    };
    next(error);
    return
  }
  // get binary
  if (req.file) {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 160, height: 160 })
      .png()
      .toBuffer()
    req.body.imgUrl = buffer
  }
  req.body.updated = Date.now();
  // Try Validate
  await SkillModel.updateOne({ key: req.params.key }, { $set: req.body })
    .then(() => res.json(req.body))
    .catch(err => {
      next(err)
      return
    })
});

/* Delete */
SkillRoute.delete('/api/skills/:key', async (req, res, next) => {
  const message = {
    message: '刪除成功',
    key: req.params.key,
  };
  const error = {
    statusCode: 400,
    message: '查無資料',
  };

  // 搜尋是否存在
  await SkillModel.findOne({ key: req.params.key })
    .then(async (data) => {
      await SkillModel.deleteOne({ key: req.params.key })
        .then(data => data.deletedCount === 0 ? next(error) : res.json(message))
        .catch(err => next(err))
    })
    .catch(e => {
      next(error)
      return
    });
});

module.exports = SkillRoute;