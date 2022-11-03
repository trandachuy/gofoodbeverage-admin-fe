/**
 * Example page
 */

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { ExampleComponent } from "./components/example.component";

// import some libs or components here

import "./example.page.scss";

export function ExamplePage(props) {
  // use for translate
  const [t] = useTranslation();

  // use for routing history
  const history = useHistory();

  // use for current state
  const location = useLocation();

  const childComponentRef = useRef();

  // define some variables here
  // exp: const [state, setState] = useState({});

  // Similar to componentDidMount and componentDidUpdate:
  // docs: https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {}, []);

  const onUpdate = () => {
    // do something here

    // call function from child component
    if (childComponentRef && childComponentRef.current) {
      childComponentRef.current.publicFunction();
    }
  };

  // render html here
  return (
    <>
      <ExampleComponent ref={childComponentRef} />
    </>
  );
}
