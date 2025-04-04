const multer = require('multer');

const storage = multer.memoryStorage(); // ✅ Store in memory (Buffer)

const upload = multer({ storage: storage });

module.exports = upload;