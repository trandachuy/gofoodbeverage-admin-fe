import { CheckOutlined } from "@ant-design/icons";
import React from "react";

import "./fnb-step.scss";

export const Step = (props) => {
  const { current, index, onChange, className, description, icon, onClick, title, isProcessing } = props;

  const onClickStep = () => {
    if (onClick) {
      onClick(index);
    }

    if (onChange) {
      onChange(index);
    }
  };

  return (
    <>
      <div
        className={`fnb-steps-item${current === index ? " fnb-steps-item-process" : ""}${
          current !== index ? " fnb-steps-item-wait" : ""
        }${current > index ? " fnb-steps-item-finish" : ""}${className ? ` ${className}` : ""}${
          current > index && isProcessing === true ? " processing" : ""
        }`}
      >
        <div className="fnb-steps-item-container">
          {icon ? (
            <div className="fnb-steps-item-icon-custom" onClick={onClickStep}>
              {icon}
            </div>
          ) : (
            <div className="fnb-steps-item-icon" onClick={onClickStep}>
              <CheckOutlined />
            </div>
          )}
          <div className="fnb-steps-item-content">
            <div className="fnb-steps-item-status"></div>
          </div>
          <div className="item-content" onClick={onClickStep}>
            <div className="fnb-steps-item-title">{title}</div>
            <div className="fnb-steps-item-description">{description}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export function FnbSteps(props) {
  const { current, className, onChange, children } = props;

  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      return React.cloneElement(child, {
        onChange,
        current,
        index,
      });
    });
  };

  return (
    <div className={`fnb-steps fnb-steps-horizontal fnb-steps-label-horizontal ${className}`}>{renderChildren()}</div>
  );
}
