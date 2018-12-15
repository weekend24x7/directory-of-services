import express from 'express';
import { postOrganisation, editOrganisation, deleteBranch } from '../controllers/post_controller';
import { seedData } from '../controllers/postInitialData';
import helpers from '../../library/helpers'
import {
  getAllOrgainisation,
  getListOfCategories,
  getListOfBoroughs,
  getListOfAreas,
  getBranchesByCategory,
  getBranchesByDay,
  getBranchesByBorough,
  getBranchesByPostcode,
  getSingleBranch
} from '../controllers/get_controller';

const router = express.Router();

router.delete('/organisation/delete', async (req, res) => {
  const { orgId, branchId } = req.query;
  try {
    if (!orgId || !branchId) {
      throw new Error('REQUIRED_DATA_NOT_SUPPLIED');
    }
    const response = await deleteBranch(orgId, branchId);
    res.status(200).json({
      success: true,
      message: 'Branch has been deleted successfully',
      response
    });
  } catch (error) {
    res
      .status(502)
      .json({ success: false, message: 'There is an error occurred', error });
  }
});

router.post('/organisation/add', async (req, res) => {
  const data = req.body;
  try {
    if (!data.organisation || !data.categories) {
      throw new Error('REQUIRED_DATA_NOT_SUPPLIED');
    }
    if (data.categories.length > 1) {
      data.categories.map(async category => {
        const graph = helpers.addOrgSchema(data, category);
        await postOrganisation(graph);
        res.status(200).json({
          success: true,
          message: 'The organisation has been saved successfully',
          data: graph
        });
      })
    } else {
      const category = data.categories[0]
      const graph = helpers.addOrgSchema(data, category);
      await postOrganisation(graph);
      res.status(200).json({
        success: true,
        message: 'The organisation has been saved successfully',
        data: graph
      });
    }
  } catch (err) {
    res.status(502).json({
      success: false,
      message: 'The organisation is not saved!',
      err
    });
  }
});

router.put('/organisation/edit', async (req, res) => {
  const { branchId } = req.body;
  const { orgId } = req.body;
  const data = req.body;
  try {
    if (data.categories.length > 1) {
      const { originalCategory } = data
      if (originalCategory.length > 0) {
        // If there is default category and new list of categories
        // Edit the default category with it new content
        const graph = helpers.editOrgSchema(data, orgId, branchId, originalCategory)
        const editOriginalBranch = await editOrganisation(graph, orgId, branchId);

        // Create new branches for new list of categories with same content accept the categories
        const addNewBranches = await data.categories.filter(category => category !== originalCategory)
          .map(async category => {
            const addGraph = helpers.addOrgSchema(data, category);
            const response = await postOrganisation(addGraph);
            return response;
          })

        res.status(200).json({
          success: true,
          message: 'The organisation has been updated successfully',
          editOriginalBranch,
          addNewBranches
        })

      } else {
        // If there is only new list of categories
        data.categories.map(async category => {
          const graph = helpers.addOrgSchema(data, category);
          const response = await postOrganisation(graph);
          res.status(200).json({
            success: true,
            message: 'The organisation has been updated successfully',
            response
          })
        })
      }
    } else {
      // If there is only one category
      const category = data.categories[0]
      const graph = helpers.editOrgSchema(data, orgId, branchId, category)
      const response = await editOrganisation(graph, orgId, branchId);
      res.status(200).json({
        success: true,
        message: 'The organisation has been updated successfully',
        response
      });
    }
  } catch (err) {
    res.status(502).json({
      success: false,
      message: 'The organisation did not save!',
      err: err.message
    });
  }
});

router.get('/all', async (req, res) => {
  try {
    // Encode data
    const services = await getAllOrgainisation()
    const b64Data = Buffer.from(JSON.stringify(services)).toString('base64')
    res.status(200).json(JSON.stringify(b64Data))

  } catch (err) {
    res.status(502).json(err);
  }
});

router.get('/organisation/branch', async (req, res) => {
  const { orgId, branchId } = req.query
  try {
    await getSingleBranch(orgId, branchId).then(branch =>
      res.status(200).json(branch));
  } catch (err) {
    res.status(502).json(err)
  }
});

router.get('/migrate', async (req, res) => {
  try {
    const allData = await getAllOrgainisation();
    if (allData.length > 0) {
      return res
        .status(502)
        .json({ success: false, message: 'Data is already migrated' });
    }
    await seedData();
    const data = await res.status(200).json({
      success: true,
      message: 'Data is migrated successfully into database!'
    });
    return data;
  } catch (err) {
    return res.status(502).json(err);
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await getListOfCategories()
    res.status(200).json(categories)
  } catch (err) {
    res.status(502).json(err);
  }
});

router.get('/boroughs', async (req, res) => {
  try {
    getListOfBoroughs().then(boroughs => res.status(200).json(boroughs));
  } catch (err) {
    res.status(502).json(err);
  }
});

router.get('/areas', async (req, res) => {
  try {
    await getListOfAreas().then(areas => res.status(200).json(areas));
  } catch (err) {
    res.status(502).json(err);
  }
});

router.post('/postcode', async (req, res) => {
  const { category, lat, long } = req.body;
  try {
    if (!lat || !long) {
      throw new Error('REQUIRED_DATA_NOT_SUPPLIED');
    }
    const data = await getBranchesByPostcode(category, lat, long);
    res.status(200).json({
      success: true,
      message: 'The Postcode has been saved successfully',
      data
    });

  } catch (err) {
    res.status(502).json({
      success: false,
      message: 'The Postcode is not saved!',
      err
    });
  }
});

router.get('/category', async (req, res) => {
  try {
    const { category } = req.query;
    await getBranchesByCategory(category).then(categories =>
      res.status(200).json(categories));
  } catch (err) {
    res.status(502).json(err);
  }
});

router.get('/day', async (req, res) => {
  try {
    const { day } = req.query;
    await getBranchesByDay(day).then(days => res.status(200).json(days));
  } catch (err) {
    res.status(502).json(err);
  }
});

router.get('/borough', async (req, res) => {
  try {
    const { borough } = req.query;
    await getBranchesByBorough(borough).then(boroughs =>
      res.status(200).json(boroughs));
  } catch (err) {
    res.status(502).json(err);
  }
});

module.exports = router;
