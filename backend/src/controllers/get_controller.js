import Organisation from '../model/Organisation';
import Categories from '../model/Categories';
import Branch from '../model/Branch';
import Address from '../model/Address';
import helpers from '../../library/helpers';

module.exports = {
  getAllOrgainisation: async () => {
    try {
      const result = await Organisation
        .query()
        /* TODO Fix relation currently it is throwing
          WARNING:
          Duplicate relation "address" in a relation expression.
          Duplicate relation "service" in a relation expression.
          Duplicate relation "branch" in a relation expression.
          You should use "a.[b, c]" instead of "[a.b, a.c]". This will cause an error in objection 2.0
        */
        .eager('[branch, branch.[address, address.[location] service, service.[categories]] ]')
        .map(data => helpers.flattenBranchData(data));
      return helpers.flattenBranchArrays(result);
    } catch (error) {
      return error;
    }
  },

  getSingleBranch: async (orgId, branchId) => {
    try {
      const result = await Organisation.query()
        .eagerAlgorithm(Organisation.JoinEagerAlgorithm)
        .eager('[branch]')
        .where('branch.org_id', '=', orgId)
        .andWhere('branch.id', '=', branchId)
      return result;
    } catch (error) {
      return error
    }
  },

  getListOfCategories: async () => {
    try {
      const result = await Categories.query().skipUndefined()
        .select('cat_name')
        .orderBy('cat_name')
        .distinct('cat_name')
        .map(categories => categories.cat_name)
      return result;
    } catch (err) {
      return err;
    }
  },

  getListOfBoroughs: async () => {
    try {
      const result = await Branch.query().skipUndefined()
        .select('borough')
        .orderBy('borough')
        .distinct('borough')
        .map(borough => borough.borough);
      return result;
    } catch (err) {
      return err;
    }
  },

  getListOfAreas: async () => {
    try {
      const result = await Address.query().skipUndefined()
        .select('area')
        .orderBy('area')
        .distinct('area')
        .map(area => area.area);
      return result;
    } catch (err) {
      return err;
    }
  },

  getBranchesByPostcode: async (categoryName, latInfo, longInfo) => {
    // Get list of branches filtered by category name and postcode
    if (categoryName) {
      const latLongs = [];
      try {
        const result = await Organisation
          .query()
          .eagerAlgorithm(Organisation.JoinEagerAlgorithm)
          .eager('[branch, branch.[address, address.[location] service, service.[categories]] ]')
          .where('branch:service:categories.cat_name', 'like', `%${categoryName}%`)
          .map(data => helpers.flattenBranchData(data))
          .map(branches => branches.map(data => {
            const { lat, long } = data;
            return latLongs.push({ lat, long, data })
          }))
          .then(() => helpers.geoNear(latInfo, longInfo, latLongs));
        return result;
      } catch (error) {
        return error;
      }
    }
    // Get all branches filtered by only postcode
    const latLongs = [];
    try {
      const result = await Organisation
        .query()
        .eagerAlgorithm(Organisation.JoinEagerAlgorithm)
        .eager('[branch, branch.[address, address.[location] service, service.[categories]] ]')
        .map(data => helpers.flattenBranchData(data))
        .map(branches => branches.map(data => {
          const { lat, long } = data;
          return latLongs.push({ lat, long, data })
        }))
        .then(() => helpers.geoNear(latInfo, longInfo, latLongs));
      return result;
    } catch (error) {
      return error;
    }
  },

  getBranchesByCategory: async categoryName => {
    try {
      const result = await Organisation
        .query()
        .eagerAlgorithm(Organisation.JoinEagerAlgorithm)
        .eager('[branch, branch.[address, address.[location] service, service.[categories]] ]')
        .where('branch:service:categories.cat_name', 'like', `%${categoryName}%`)
        .map(data => helpers.flattenBranchData(data))
      return helpers.flattenBranchArrays(result);
    } catch (error) {
      return error;
    }
  },

  getBranchesByDay: async day => {
    try {
      const result = await Organisation
        .query()
        .eagerAlgorithm(Organisation.JoinEagerAlgorithm)
        .eager('[branch, branch.[address, address.[location] service, service.[categories]] ]')
        .where('branch:service.service_days', 'like', `%${day}%`)
        .map(data => helpers.flattenBranchData(data))
      return helpers.flattenBranchArrays(result);
    } catch (error) {
      return error;
    }
  },

  getBranchesByBorough: async boroughName => {
    try {
      const result = await Organisation
        .query()
        .eagerAlgorithm(Organisation.JoinEagerAlgorithm)
        .eager('[branch, branch.[address, address.[location] service, service.[categories]] ]')
        .where('branch.borough', 'like', `%${boroughName}%`)
        .map(data => helpers.flattenBranchData(data))
      return helpers.flattenBranchArrays(result);
    } catch (error) {
      return error;
    }
  }
};
