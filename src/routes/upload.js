const express = require('express');
const router = express.Router();

const { createUpload } = require('../api/upload');

router.post('/', (req, res) => {
  createUpload(req, res);
});

module.exports = router;
