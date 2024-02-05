//showMessage panel.
//Not used in this project.
import React from "react";
import ShowModal from "./showModal";

const ShowMessage = ({ show, message }) => {
  return (
    <ShowModal show={show} mainClassName="showMessage" right="20%" bottom="20%">
      <span>{message}</span>
    </ShowModal>
  );
};

export default ShowMessage;
