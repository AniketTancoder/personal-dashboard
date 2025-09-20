const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

router.get('/time', (req, res) => {
  res.json({ time: new Date().getTime() });
});

module.exports = router;