//all the constants are here
export var constants = (function () {
  const {
    REACT_APP_BASE_URL,
    REACT_APP_BASE_API_PREFIX,
    REACT_APP_CATEGORIES_API_PREFIX,
    REACT_APP_VEHICLES_API_PREFIX,
    REACT_APP_MANIFACTURERS_API_PREFIX,
  } = process.env;

  const BASE_API_URL = REACT_APP_BASE_URL + REACT_APP_BASE_API_PREFIX;
  const VEHICLES_API_URL = BASE_API_URL + REACT_APP_VEHICLES_API_PREFIX;
  const CATEGORIES_API_URL = BASE_API_URL + REACT_APP_CATEGORIES_API_PREFIX;
  const MANIFACTURERS_API_URL =
    BASE_API_URL + REACT_APP_MANIFACTURERS_API_PREFIX;
  const CATEGORIES_ICON_URL = REACT_APP_BASE_URL + "/images/categoryIcons/";
  const MAX_IMAGE_UPLOAD_SIZE = 1024 * 1024;
  const WRONG_IMAGE_ERROR =
    "The file must be an image whose size is smaller than or equal to 1 MB";
  const POSITIVE_NUMBER_RULE = "textIsPositiveNumber";
  const REQUIRED_RULE = "textIsRequired";
  const MAX_WEIGHT = 1000000;

  const FETCH_OPTIONS = {
    cacheLife: 0,
    cachePolicy: "no-cache",
  };

  return {
    VEHICLES_API_URL,
    CATEGORIES_API_URL,
    MANIFACTURERS_API_URL,
    FETCH_OPTIONS,
    BASE_URL: REACT_APP_BASE_URL,
    BASE_API_URL,
    CATEGORIES_ICON_URL,
    MAX_IMAGE_UPLOAD_SIZE,
    WRONG_IMAGE_ERROR,
    POSITIVE_NUMBER_RULE,
    REQUIRED_RULE,
    MAX_WEIGHT,
  };
})();
