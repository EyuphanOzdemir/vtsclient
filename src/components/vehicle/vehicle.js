//very similar to category and manifacturer components.
//so refer to category component.
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
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
import GlobalDataContext from "../../contexts/GlobalDataContext";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MessagePanel from "../../commonComponents/messagePanel";
import CruButtons from "../../commonComponents/cruButtons";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: 250,
  },
}));

const Vehicle = () => {
  const { manifacturers } = useContext(GlobalDataContext);
  const classes = useStyles();
  let history = useHistory();
  //id for editing only
  let { id } = useParams();
  id = id ?? 0;

  const years = useRef(utilityMethods.range(1950, new Date().getFullYear()));

  const zeroState = useRef({
    id: 0,
    ownerName: "",
    manifacturerId:
      manifacturers.length && manifacturers.length > 0
        ? manifacturers[0].id
        : 0,
    manifacturer: "",
    yearOfManifacture: new Date().getFullYear(),
    categoryId: 0,
    weight: 0,
    categoryName: "",
    iconFileName: "",
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
    constants.VEHICLES_API_URL,
    constants.FETCH_OPTIONS
  );

  useEffect(() => {
    async function loadVehicle() {
      var vehicle = await get("/" + id.toString());
      if (vehicle && vehicle.ownerName) {
        setState(vehicle);
        updateUIState(true, "Vehicle loaded/reloaded successfully");
      } else {
        updateUIState(false, "Vehicle could not load");
        setHideForm(true);
      }
    }

    if (id > 0) loadVehicle();

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

  const payload = {
    ownerName: state.ownerName,
    weight: state.weight,
    yearOfManifacture: state.yearOfManifacture,
    manifacturerId: state.manifacturerId,
  };

  const checkYear = () => {
    if (!state.yearOfManifacture) {
      updateUIState(false, "Year of manifacture is required");
      return false;
    }
    return true;
  };

  async function addVehicle() {
    if (!utilityMethods.checkWeight(state.weight, updateUIState)) return;
    if (!checkYear()) return;
    await post("", payload);
    if (response.ok) {
      setState(zeroState.current);
      updateUIState(
        true,
        "Vehicle added successfully. You can create another one..."
      );
    } else {
      updateUIState(false, "Vehicle could not add");
    }
  }

  async function updateVehicle() {
    if (!utilityMethods.checkWeight(state.weight, updateUIState)) return;
    if (!checkYear()) return;
    await put("", { ...payload, id });
    if (response.ok) {
      setRefreshToken(Date.now());
      updateUIState(true, "Vehicle successfully updated");
      history.push("/vehicle/" + id.toString());
    } else {
      updateUIState(false, "Vehicle could not updated");
    }
  }

  async function deleteVehicle() {
    await del("/" + state.id);
    if (response.ok) {
      updateUIState(
        true,
        "Vehicle deleted successfully. You can add a new vehicle..."
      );
      setState(zeroState.current);
      history.push("/vehicle");
    } else {
      updateUIState(false, "Vehicle could not be deleted");
    }
  }

  let submitButton = useRef("");
  const updateSubmitButton = useCallback((buttonName) => {
    submitButton.current = buttonName;
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id > 0) {
      if (submitButton.current === "CreateUpdate") updateVehicle();
      else
        confirmAlert(
          utilityMethods.getConfirmAlertOptions(
            deleteVehicle,
            "Are you sure to delete this vehicle?"
          )
        );
    } else addVehicle();
  };

  const form = (
    <div>
      <ValidatorForm onSubmit={handleSubmit}>
        <div className="form-group">
          <TextValidator
            id="ownerName"
            variant="outlined"
            label="Owner name"
            name="ownerName"
            className={classes.formControl}
            value={state.ownerName}
            onChange={(e) =>
              utilityMethods.updateStateFromEvent(state, setState, e)
            }
            validators={[constants.REQUIRED_RULE]}
            errorMessages={["Owner Name is required"]}
          />
        </div>

        <div className="form-group">
          <InputLabel id="categoryLabel">Manifacturer</InputLabel>
          <Select
            labelId="manifacturerLabel"
            variant="outlined"
            id="manifacturerId"
            name="manifacturerId"
            className={classes.formControl}
            value={state.manifacturerId}
            onChange={(e) =>
              utilityMethods.updateStateFromEvent(state, setState, e)
            }
          >
            {manifacturers &&
              manifacturers.length &&
              manifacturers.map((manifacturer) => (
                <MenuItem value={manifacturer.id} key={manifacturer.id}>
                  {manifacturer.name}
                </MenuItem>
              ))}
          </Select>
        </div>

        <div className="form-group">
          <TextValidator
            variant="outlined"
            label="Weight"
            name="weight"
            className={classes.formControl}
            value={state.weight}
            onChange={(e) =>
              utilityMethods.updateStateFromEvent(state, setState, e)
            }
            validators={[constants.POSITIVE_NUMBER_RULE]}
            errorMessages={"Weight should be a positive number"}
          />
        </div>

        <div className="form-group">
          <Autocomplete
            id="yearOfManifacture"
            name="yearOfManifacture"
            className={classes.formControl}
            options={years.current}
            getOptionLabel={(option) => option.toString()}
            value={state.yearOfManifacture}
            onChange={(event, newValue) => {
              setState({ ...state, yearOfManifacture: newValue });
            }}
            renderInput={(params) => (
              <TextValidator
                {...params}
                label="Year of manifacture"
                variant="outlined"
              />
            )}
          />
        </div>

        {id > 0 && (
          <div className="form-group">
            <label>Category:{state.categoryName}</label>
          </div>
        )}

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
            history.push("/vehicle");
          }}
        >
          Create a vehicle
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

export default Vehicle;
