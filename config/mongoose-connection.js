const mongoose = require('mongoose');
require('dotenv').config();

mongoose
.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("MongoDB connected successfully");
    
  })
  .catch((err) => {
    console.log(err.message);
  });

  
module.exports = mongoose.connection;
