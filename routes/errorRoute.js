const express = require('express');
const router = express.Router();

router.get('/trigger-error', (req, res, next) => {
  const err = new Error('Intentional Error');
  err.status = 500;
  next(err); 
});

module.exports = router;
