//all the common utility methods here
import { constants } from "../modules/constants";
export const getConfirmAlertOptions = (yesFunction, message) => {
  return {
    title: "Confirmation needed",
    message,
    buttons: [
      {
        label: "Yes",
        onClick: () => yesFunction(),
      },
      {
        label: "No",
      },
    ],
  };
};

export function updateStateFromEvent(state, setStateFunction, event) {
  let value = event.target.value;
  if (event.target.type && event.target.type.toLowerCase() === "checkbox")
    value = event.target.checked;
  let newState = { ...state, [event.target.name]: value };
  setStateFunction(newState);
  return true;
}

export const checkImage = (image) => {
  return image.size <= constants.MAX_IMAGE_UPLOAD_SIZE;
};

export const stringifyFetchData = (data) => {
  if (data) {
    if (data.status && data.title) return data.status + ":" + data.title;
    else {
      if (typeof data === "string" || data instanceof String) return data;
      else return "";
    }
  } else return "";
};

export function range(start, end) {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
}

export function checkWeight(weight, updateUI) {
  if (weight > constants.MAX_WEIGHT) {
    updateUI(false, `Maximum weight is ${constants.MAX_WEIGHT} kg`);
    return false;
  }
  return true;
}
