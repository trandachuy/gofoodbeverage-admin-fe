import "./index.scss";
import React from "react";
import { capitalizeFirstLetterEachWord } from "utils/helpers";

export default function DialogTitle(props) {
  const { className, content } = props;
  return (
    <>
      <h1 className={`fnb-dialog-title ${className ? className : ""}`}>{capitalizeFirstLetterEachWord(content)}</h1>
    </>
  );
}
