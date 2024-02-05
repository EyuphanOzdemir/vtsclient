//all the validation check methods are here.
//not all of them are used in this project but we may need them.
export const username = (value) => {
  return !(value.length < 3 || value.length > 20);
};

export const password = (value) => {
  return !(value.length < 6 || value.length > 40);
};

export const pin = (value) => {
  return !(value.length !== 5 || !allNumeric(value));
};

export function allNumeric(text) {
  var numbers = /^[0-9]+$/;
  return text.match(numbers);
}

export function textIsNumber(text) {
  let notANumber = isNaN(text);
  return !notANumber;
}

export function textIsPositiveNumber(text) {
  if (isNaN(text)) return false;
  return parseFloat(text) > 0;
}

export function textIsNaturalNumber(text) {
  if (isNaN(text)) return false;
  return parseFloat(text) >= 0;
}

export const match = (value1, value2) => {
  return value1 === value2;
};

export const textIsRequired = (value) => {
  return value && value.toString().trim().length > 0;
};
