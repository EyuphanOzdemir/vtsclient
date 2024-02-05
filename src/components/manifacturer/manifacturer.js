//very similar to category and vehicle components.
//so refer to category category component.

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
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
import GlobalDataContext from "../../contexts/GlobalDataContext";
import { manifacturerMethods } from "../../modules/manifacturerMethods";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: 250,
  },
}));

const Manifacturer = () => {
  const { manifacturers, setManifacturers } = useContext(GlobalDataContext);
  const classes = useStyles();
  let history = useHistory();
  //id for editing only
  let { id } = useParams();
  id = id ?? 0;

  const zeroState = useRef({
    id: 0,
    name: "",
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
  const [refreshToken, setRefreshToken] = useState(Date.now());
  const [hideForm, setHideForm] = useState(false);

  const { get, post, put, del, response, loading, error, data } = useFetch(
    constants.MANIFACTURERS_API_URL,
    constants.FETCH_OPTIONS
  );

  useEffect(() => {
    async function loadManifacturer() {
      var manifacturer = await get("/" + id.toString());
      if (manifacturer && manifacturer.name) {
        setState(manifacturer);
        updateUIState(true, "Manifacturer loaded/reloaded successfully");
      } else {
        updateUIState(false, "Manifacturer could not load");
        setHideForm(true);
      }
    }

    if (id > 0) loadManifacturer();

    if (!ValidatorForm.hasValidationRule(constants.REQUIRED_RULE)) {
      ValidatorForm.addValidationRule(constants.REQUIRED_RULE, (value) =>
        validations.textIsRequired(value)
      );
    }

    return () => {
      if (ValidatorForm.hasValidationRule(constants.REQUIRED_RULE))
        ValidatorForm.removeValidationRule(constants.REQUIRED_RULE);
    };
  }, [id, get, refreshToken]);

  async function addManifacturer() {
    const payload = { name: state.name };
    const insertedManifacture = await post("", payload);
    if (response.ok) {
      setState(zeroState.current);
      updateUIState(
        true,
        "Manifacturer added successfully. You can create another one..."
      );
      setManifacturers(
        manifacturerMethods.addManifacturer(manifacturers, insertedManifacture)
      );
    } else {
      updateUIState(false, "Manifacturer could not add");
    }
  }

  async function updateManifacturer() {
    await put("", state);
    if (response.ok) {
      setManifacturers(
        manifacturerMethods.updateManifacturer(manifacturers, state)
      );
      setRefreshToken(Date.now());
      updateUIState(true, "Manifacturer successfully updated");
      history.push("/manifacturer/" + id.toString());
    } else {
      updateUIState(false, "Manifacturer could not updated");
    }
  }

  async function deleteManifacturer() {
    await del("/" + state.id);
    if (response.ok) {
      setManifacturers(
        manifacturerMethods.deleteManifacturer(manifacturers, state.id)
      );
      updateUIState(
        true,
        "Manifacturer deleted successfully. You can add a new manifacture..."
      );
      setState(zeroState.current);
      history.push("/manifacturer");
    } else {
      updateUIState(false, "Manifacturer could not be deleted");
    }
  }

  let submitButton = useRef("");
  const updateSubmitButton = useCallback((buttonName) => {
    submitButton.current = buttonName;
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id > 0) {
      if (submitButton.current === "CreateUpdate") updateManifacturer();
      else
        confirmAlert(
          utilityMethods.getConfirmAlertOptions(
            deleteManifacturer,
            "Are you sure to delete this manifacturer?"
          )
        );
    } else addManifacturer();
  };

  const form = (
    <div>
      <ValidatorForm onSubmit={handleSubmit}>
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

        <CruButtons
          updateSubmitButtonFunction={updateSubmitButton}
          loading={loading}
          submitButtonType={submitButton.current}
          id={id}
        />
      </ValidatorForm>
    </div>
  );

  const links =
    id > 0 ? (
      <div className="form-group">
        <button
          className="btn btn-primary btn"
          onClick={() => {
            setState(zeroState.current);
            setUIState(true, "");
            history.push("/manifacturer");
          }}
        >
          Create a manifacturer
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

export default Manifacturer;
