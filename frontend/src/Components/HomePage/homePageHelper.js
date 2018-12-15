import helpers from '../../helpers';

// This function check for each organisation if the query enters by the user is include on one of the input field (org_name, borough ...)
// and return that organisation if at least one input field pass the.

function findOrganisationByCheckingField(orgs, userQuery) {
  const arr            = [];
  const excludedFields = ["lat", "telephone", "long", "website"];
  orgs.filter(org => (
    Object.keys(org)
    .map(key => (
      userQuery.map(item => {
        const isKeyValueNumber = typeof (org[key]) !== 'number';
        const isQueryHasMatch = isKeyValueNumber && org[key] !== null && org[key].toLowerCase().includes(item.toLowerCase())
        if (isQueryHasMatch && !excludedFields.includes(key)) {
          arr.push(org);
        }
        return arr;
      })
    ))
  ))
  return [...new Set(arr)];
}

const filterData = (orgs, search, postcodeValue) => {
  const userQuery = search.trim().split(' ');
  if (search && postcodeValue) {
    return findOrganisationByCheckingField(orgs, userQuery);
  } else if (search) {
    const output = findOrganisationByCheckingField(orgs, userQuery);
    return output.sort(helpers.sortArrObj)
  } else if (postcodeValue) {
    return orgs
  }
  return [];
}

// This function return organisation that match the borough or the area enter by the user
function findOrganisationByLocation(orgs, userQuery) {
  const location = userQuery.trim().split(' ');
  const arr      = [];
  orgs.filter(org => (
    Object.keys(org)
    .map(key => (
      location.map(item => {
        const isKeyValueNumber = typeof (org[key]) !== 'number';
        const isQueryHasMatch  = isKeyValueNumber ? org[key].toLowerCase().includes(item.toLowerCase()): null;
        if (isQueryHasMatch &&
          (key === 'borough' || key === 'area') &&
          org[key].toLowerCase().includes(item.toLowerCase())) {
          arr.push(org);
        }
        return arr;
      })
    ))
  ))
  return [...new Set(arr)];
}

export default {
  filterData,
  findOrganisationByLocation
}