import './index.scss';
import React from "react";
import { capitalizeFirstLetterEachWord } from "utils/helpers";

export default function PageTitle(props) {
  const { className, content } = props;
  return (
    <>
      <h1 className={`fnb-title-header ${className}`}>{capitalizeFirstLetterEachWord(content)}</h1>
    </>
  );
}
