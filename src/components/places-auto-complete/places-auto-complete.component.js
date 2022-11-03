import React, { useState } from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import { Col, Input, Row } from "antd";
import "./style.scss";
import { CloseCircleIcon, LocationIcon, SearchIcon } from "constants/icons.constants";

const { forwardRef, useImperativeHandle } = React;

export const PlacesAutocomplete = forwardRef((props, ref) => {
  const {
    onSelectLocation,
    onEmptyLocation,
    inputClassName,
    addressPopoverClassName,
    textOverflowClassName,
    inputPlaceholder,
  } = props;
  const [isError, setIsError] = useState(false);
  const [isDefaultCountry, setIsDefaultCountry] = useState(true);

  useImperativeHandle(ref, () => ({
    setIsError(isError) {
      setIsError(isError);
    },
    clearCurrentLocation() {
      setValue(null);
      setIsError(false);
    },
    setDefaultCountry(isDefault) {
      setIsDefaultCountry(isDefault);
    },
    setAddressWhenEdit(address) {
      setValue(address);
    },
  }));

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
      region: isDefaultCountry ? "vn" : "",
      language: isDefaultCountry ? "vi" : "",
    },
    debounce: 300,
  });

  const refClickOutside = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    const value = e.target.value;
    setValue(value);
    if (!value) {
      onEmptyLocation();
      setIsError(true);
    } else {
      setIsError(false);
    }
  };

  const handleSelect = async ({ description }) => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(description, false);
    clearSuggestions();

    // Get latitude and longitude via utility functions
    let results = await getGeocode({ address: description });
    if (results) {
      const { lat, lng } = getLatLng(results[0]);
      onSelectLocation({
        center: { lat, lng },
        address: description,
      });
    }
  };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <div className="address-popover-item" key={place_id} onClick={() => handleSelect(suggestion)}>
          <Row>
            <Col span={1}>
              <div className="d-flex icon-box">
                <span className="icon-location">
                  <LocationIcon />
                </span>
              </div>
            </Col>
            <Col span={23}>
              <div className="address-box">
                <p className={`mb-0 street-text text-overflow ${textOverflowClassName}`}>{main_text}</p>
                <p className={`mb-0 ward-text text-overflow ${textOverflowClassName}`}>{secondary_text}</p>
              </div>
            </Col>
          </Row>
        </div>
      );
    });

  return (
    <div ref={refClickOutside}>
      <Input
        className={`fnb-input select-address-input ${inputClassName} ${isError && "error-address-input"}`}
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder={inputPlaceholder}
        prefix={<SearchIcon />}
        allowClear={{ clearIcon: <CloseCircleIcon /> }}
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && <div className={`address-popover ${addressPopoverClassName}`}>{renderSuggestions()}</div>}
    </div>
  );
});
