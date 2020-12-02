const mongoose = require('mongoose');
mongoose.set('runValidators', true);

const DB_CONNECT_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const db = {
  connect: () => {
    mongoose
      .connect(process.env.MONGODB_URI,
       DB_CONNECT_OPTIONS)
      .then(() => console.log("Database is connected."))
      .catch((err) => console.log(err));
  },
};
module.exports = db