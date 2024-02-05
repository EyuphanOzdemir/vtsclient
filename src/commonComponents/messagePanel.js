//this is used in all the entity components (Vehicle, Manifacturer, Category)
import * as utilityMethods from "../modules/utilityMethods";

const messagePanel = ({ uiState, data, error }) => {
  let messages = (
    <>
      <p>{uiState.message && uiState.message}</p>
      <p>{utilityMethods.stringifyFetchData(data)}</p>
      <p>{error && "(Error:" + error.toString() + ")"}</p>
    </>
  );

  return (
    <div className="form-group">
      <div
        className={
          uiState.successful ? "alert alert-primary" : "alert alert-danger"
        }
        role="alert"
      >
        {messages}
      </div>
    </div>
  );
};

export default messagePanel;
