//A general popup panel.
//Not used in this project.
import React, { useState } from "react";
import ReactModal from "react-modal";
import Button from "@material-ui/core/Button";
const ShowModal = ({
  show,
  children,
  mainClassName,
  top,
  left,
  right,
  bottom,
}) => {
  const [state, setState] = useState({ showModal: show });

  const handleCloseModal = () => {
    setState({ showModal: false });
  };

  return (
    <div>
      <ReactModal
        ariaHideApp={false}
        isOpen={state.showModal}
        style={{
          content: {
            position: "fixed",
            backgroundColor: "unset",
            border: "0px",
            top: top ?? "50%",
            left: left ?? "25%",
            right: right ?? "20%",
            bottom: bottom ?? "20%",
          },
          overlay: {
            backgroundColor: "unset",
            border: "0px",
          },
        }}
      >
        <div className={mainClassName}>
          <div>{children}</div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseModal}
              style={{ textTransform: "none" }}
            >
              Close
            </Button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default ShowModal;
