/**
 * Example page
 */

import React, { useEffect } from "react";

import { useTranslation } from "react-i18next";

export const ExampleComponent = React.forwardRef((props, ref) => {
  const [t] = useTranslation();

  // define some variables here
  // exp: const [state, setState] = useState({});

  // Define some functions to export here
  React.useImperativeHandle(ref, () => ({
    publicFunction() {
      privateFunction();
    },
  }));

  useEffect(() => {}, []);

  const privateFunction = () => {
    // do something here
  };

  return <></>;
});
