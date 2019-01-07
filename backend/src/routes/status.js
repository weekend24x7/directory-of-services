import express from 'express';

import { knex } from '../../config';

const router = express.Router();

async function tryDatabaseAccess(res) {
  try {
    await knex.raw('select 1+1 as result');
    return {
      success: true,
      message: 'Database access ok'
    };
  } catch (err) {
    return res.status(503).json({ message: 'no database connection' })
  }
}

router.get('/', async (req, res) => {
  const checks = [await tryDatabaseAccess(res)];
  res.json(checks);
});

export default router;
