const express = require('express');

const router = express.Router();

/* GET api page. */
router.get('/', (req, res) => {
  res.send({ id: 1, categoryTitle: 'Health Care' });
});

module.exports = router;