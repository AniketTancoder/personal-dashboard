const express = require('express');
const router = express.Router();
const process = require('process');

let startTime = Date.now();

router.get('/', (req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: uptime,
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;