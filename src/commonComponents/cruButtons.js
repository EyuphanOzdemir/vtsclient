//Created Create and Update buttons for all entity components (Manifacturer, Vehicle, Category)
const cruButtons = ({
  updateSubmitButtonFunction,
  loading,
  submitButtonType,
  id,
  extraDisabledConditionForDelete = false,
}) => {
  return (
    <div className="form-group">
      <button
        className="btn btn-primary btn-block"
        onClick={() => updateSubmitButtonFunction("CreateUpdate")}
        disabled={loading}
        value="CreateUpdateValue"
      >
        {loading && submitButtonType === "CreateUpdate" && (
          <span className="spinner-border spinner-border-sm"></span>
        )}
        {id > 0 ? "Update" : "Create"}
      </button>
      {id > 0 && (
        <button
          className="btn btn-secondary btn-block"
          disabled={loading || extraDisabledConditionForDelete}
          onClick={() => updateSubmitButtonFunction("Delete")}
          value="DeleteValue"
        >
          {loading && submitButtonType === "Delete" && (
            <span className="spinner-border spinner-border-sm"></span>
          )}
          Delete
        </button>
      )}
    </div>
  );
};

export default cruButtons;
