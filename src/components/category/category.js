//for creating/editing/deleting a category.
//Edit is possible with the id query parameter.
//After updating, the entity is loaded again to reflect and check all the modifications.

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { constants } from "../../modules/constants";
import useFetch from "use-http";
import * as validations from "../../modules/validations";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import * as utilityMethods from "../../modules/utilityMethods";
import MessagePanel from "../../commonComponents/messagePanel";
import CruButtons from "../../commonComponents/cruButtons";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: 250,
  },
}));

const Category = () => {
  const classes = useStyles();
  let history = useHistory();
  //id for editing only
  let { id } = useParams();
  id = id ?? 0;

  const zeroState = useRef({
    name: "",
    minWeight: 0,
    upTo: 0,
    iconFileName: "",
    icon: null,
  });

  const initialUiState = {
    successful: true,
    message: "",
  };

  const updateUIState = (successful, message) => {
    setUIState({ successful, message });
  };

  const [state, setState] = useState(zeroState.current);
  const [uiState, setUIState] = useState(initialUiState);
  //this is used to clear the upload file
  const [inputKey, setInputKey] = useState(Date.now());

  //this is used to refresh the icon after updating
  const [refreshToken, setRefreshToken] = useState(Date.now());

  //to hide the form if needed (e.g. when the entity could not be loaded)
  const [hideForm, setHideForm] = useState(false);

  //to check the category is the root category.
  //if it is. it cannot be deleted and the minWeight is disabled.
  const [originalMinWeight, setoriginalMinWeight] = useState(0);

  const { get, post, put, del, response, loading, error, data } = useFetch(
    constants.CATEGORIES_API_URL,
    constants.FETCH_OPTIONS
  );

  //loading the category
  useEffect(() => {
    async function loadCategory() {
      var category = await get("/" + id.toString());
      if (category && category.name) {
        setState(category);
        updateUIState(true, "Category loaded/reloaded successfully");
        setoriginalMinWeight(category.minWeight);
      } else {
        updateUIState(false, "Category could not load");
        setHideForm(true);
      }
    }
    //if the id query param is present, load the category
    if (id > 0) loadCategory();

    //validation functions are added and removed after unmounting
    if (!ValidatorForm.hasValidationRule(constants.POSITIVE_NUMBER_RULE)) {
      ValidatorForm.addValidationRule(constants.POSITIVE_NUMBER_RULE, (value) =>
        validations.textIsPositiveNumber(value)
      );
    }

    if (!ValidatorForm.hasValidationRule(constants.REQUIRED_RULE)) {
      ValidatorForm.addValidationRule(constants.REQUIRED_RULE, (value) =>
        validations.textIsRequired(value)
      );
    }

    return () => {
      if (ValidatorForm.hasValidationRule(constants.POSITIVE_NUMBER_RULE))
        ValidatorForm.removeValidationRule(constants.POSITIVE_NUMBER_RULE);
      if (ValidatorForm.hasValidationRule(constants.REQUIRED_RULE))
        ValidatorForm.removeValidationRule(constants.REQUIRED_RULE);
    };
  }, [id, get, refreshToken]);

  //add category method
  async function addCategory() {
    if (!utilityMethods.checkWeight(state.minWeight, updateUIState)) return;
    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("minWeight", state.minWeight);
    formData.append("icon", state.icon);
    if (!state.icon) {
      updateUIState(false, "Choose an icon for the category");
      return;
    }
    if (!utilityMethods.checkImage(state.icon)) {
      updateUIState(false, constants.WRONG_IMAGE_ERROR);
      return;
    }
    await post("", formData);
    if (response.ok) {
      setState(zeroState.current);
      setInputKey(Date.now());
      updateUIState(
        true,
        "Category added successfully. You can create another one..."
      );
    } else {
      updateUIState(false, "Category could not add");
    }
  }

  //update category method
  async function updateCategory() {
    if (!utilityMethods.checkWeight(state.minWeight, updateUIState)) return;
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", state.name);
    formData.append("minWeight", state.minWeight);
    formData.append("iconFileName", state.iconFileName);
    if (state.icon != null) {
      formData.append("icon", state.icon);
      if (!utilityMethods.checkImage(state.icon)) {
        updateUIState(false, constants.WRONG_IMAGE_ERROR);
        return;
      }
    }

    await put("", formData);
    if (response.ok) {
      setInputKey(Date.now());
      setRefreshToken(Date.now());
      updateUIState(true, "Category successfully updated");
      history.push("/category/" + id.toString());
    } else {
      updateUIState(false, "Category could not updated");
    }
  }

  //delete category method
  async function deleteCategory() {
    if (originalMinWeight === 0) {
      updateUIState(
        false,
        "The category whose minimum weight is 0 cannot be deleted!"
      );
      return;
    }
    await del("/" + state.id);
    if (response.ok) {
      updateUIState(
        true,
        "Category deleted successfully. You can add a new category..."
      );
      setState(zeroState.current);
      history.push("/category");
    } else {
      updateUIState(false, "Category could not be deleted");
    }
  }

  //this is to hide min weight validation error text when the category is the root category
  let validatorsForMinWeight =
    originalMinWeight > 0 || id === 0 ? [constants.POSITIVE_NUMBER_RULE] : [];
  let validatorMessagesForMinWeight =
    originalMinWeight > 0 || id === 0
      ? ["The minimum weight should be a positive number"]
      : [];

  //this is used to detect which button is clicked as the trigger of submit event
  let submitButton = useRef("");
  const updateSubmitButton = useCallback((buttonName) => {
    submitButton.current = buttonName;
  }, []);

  //general submit event handler for create/update/delete
  const handleSubmit = (e) => {
    e.preventDefault();
    if (id > 0) {
      if (submitButton.current === "CreateUpdate") updateCategory();
      else
        confirmAlert(
          utilityMethods.getConfirmAlertOptions(
            deleteCategory,
            "Are you sure to delete this category?"
          )
        );
    } else addCategory();
  };

  const form = (
    <div>
      <ValidatorForm onSubmit={handleSubmit}>
        {originalMinWeight === 0 && id > 0 && (
          <div className="form-group">
            <span className="text-danger">
              This category is the root category, cannot be deleted and minimum
              weight of it cannot be changed
            </span>
          </div>
        )}
        <div className="form-group">
          <TextValidator
            id="name"
            variant="outlined"
            label="Name"
            name="name"
            className={classes.formControl}
            value={state.name}
            onChange={(e) =>
              utilityMethods.updateStateFromEvent(state, setState, e)
            }
            validators={[constants.REQUIRED_RULE]}
            errorMessages={["Name is required"]}
          />
        </div>

        <div className="form-group">
          <TextValidator
            variant="outlined"
            label="Minimum Weight"
            name="minWeight"
            disabled={originalMinWeight === 0 && id > 0}
            className={classes.formControl}
            value={state.minWeight}
            onChange={(e) =>
              utilityMethods.updateStateFromEvent(state, setState, e)
            }
            validators={validatorsForMinWeight}
            errorMessages={validatorMessagesForMinWeight}
          />
        </div>

        {id > 0 && <label>Up to:{state.upTo}</label>}

        {id > 0 && state.iconFileName && (
          <div className="form-group">
            <img
              src={constants.CATEGORIES_ICON_URL + state.iconFileName}
              width="100px"
              height="100px"
              alt={state.iconFileName}
            />
          </div>
        )}

        <label htmlFor="upload">
          {" "}
          {id > 0 ? "Change the icon" : "Choose an icon"}
          <input
            type="file"
            onChange={(e) => setState({ ...state, icon: e.target.files[0] })}
            key={inputKey}
            id="upload"
            name="upload"
            accept="image/png, image/jpeg"
          />
        </label>
        <CruButtons
          updateSubmitButtonFunction={updateSubmitButton}
          loading={loading}
          submitButtonType={submitButton.current}
          id={id}
          extraDisabledConditionForDelete={originalMinWeight <= 0}
        />
      </ValidatorForm>
    </div>
  );

  //if the mode is edit mode (i.e. id>0), we show the create link.
  const links =
    id > 0 ? (
      <div className="form-group">
        <button
          className="btn btn-primary btn"
          onClick={() => {
            setState(zeroState.current);
            setUIState(true, "");
            history.push("/category");
          }}
        >
          Create a category
        </button>
      </div>
    ) : (
      ""
    );

  return (
    <div className="col-md-12">
      <div className="card card-container">
        {links}
        {!loading && (error || uiState.message) && (
          <MessagePanel uiState={uiState} data={data} error={error} />
        )}
        {!hideForm && form}
      </div>
    </div>
  );
};

export default Category;
