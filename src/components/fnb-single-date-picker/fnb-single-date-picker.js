import React from "react";
import { DatePicker } from "antd";
import "./fnb-single-date-picker.scss";

export default function FnbSingleDatePicker(props) {
  const { placeholder, className, dropdownClassName, disabledDate, format, onChange, showToday } = props;

  return (
    <div className="fnb-single-date-picker-component">
      <DatePicker
        placeholder={placeholder}
        className={`fnb-single-date-picker ${className}`}
        disabledDate={disabledDate}
        format={format}
        onChange={onChange}
        showToday={showToday}
        dropdownClassName={`fnb-single-date-picker-calendar ${dropdownClassName}`}
      />
    </div>
  );
}
