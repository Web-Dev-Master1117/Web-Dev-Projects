import 'whatwg-fetch';

const GoldMedalMetrics = {};
const baseUrl = 'http://localhost:3001';

GoldMedalMetrics.fixName = countryName => {
  return countryName.replace(/\w\S*/g, txt => {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

GoldMedalMetrics.getCountryDetails = country => {
  const newCountryName = GoldMedalMetrics.fixName(country);
  const url = `${baseUrl}/country/${newCountryName}`;
  return fetch(url).then(response => {
    if(!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse;
    });
  });
};

GoldMedalMetrics.getCountries = (sortBy, isAscending) => {
  let url = `${baseUrl}/country`;
  if (typeof sortBy !== 'undefined' && typeof isAscending !== 'undefined') {
    const descendingString = isAscending ? 'y' : 'n';
    url = `${baseUrl}/country?sort_by=${sortBy}&ascending=${descendingString}`;
  }

  return fetch(url).then(response => {
    if(!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      const countries = jsonResponse.countries;
      return countries;
    });
  });
};

GoldMedalMetrics.getGoldMedals = (country, sortBy, isAscending)  => {
  const newCountryName = GoldMedalMetrics.fixName(country);
  let url = `${baseUrl}/country/${newCountryName}/medals`;
  if (typeof sortBy !== 'undefined' && typeof isAscending !== 'undefined') {
    const descendingString = isAscending ? 'y' : 'n';
    url = `${baseUrl}/country/${newCountryName}/medals?sort_by=${sortBy}&ascending=${descendingString}`;
  }

  return fetch(url).then(response => {
    if(!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      const medals = jsonResponse.medals;
      return medals;
    });
  });
};

GoldMedalMetrics.getSports = (country, sortBy, isAscending) => {
  const newCountryName = GoldMedalMetrics.fixName(country);
  let url = `${baseUrl}/country/${newCountryName}/sports`;

  if (typeof sortBy !== 'undefined' && typeof isAscending !== 'undefined') {
    const ascendingString = isAscending ? 'y' : 'n';
    url = `${baseUrl}/country/${newCountryName}/sports?sort_by=${sortBy}&ascending=${ascendingString}`;
  }

  return fetch(url).then(response => {
    if(!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      const sports = jsonResponse.sports;
      return sports;
    });
  });
};

export default GoldMedalMetrics;
