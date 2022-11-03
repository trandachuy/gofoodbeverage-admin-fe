import { DatePicker } from "antd";
import { DateTimePickerIcon } from "constants/icons.constants";
import { DateFormat } from "constants/string.constants";
import moment from "moment";
import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";

export default function FnbDateTimePickerComponent({
  onChangeDateTime,
  onOk,
  className,
  placeholder,
  showSecond,
  showToday = false,
  showNowValue = false,
  defaultDateTimeValue = moment(),
}) {
  const [t] = useTranslation();
  const [dateTimeChangeValue, setDateTimeValueChange] = useState();

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().add(-1, "d");
  };

  const onSelect = (values) => {
    setDateTimeValueChange(values);
  };

  return (
    <DatePicker
      showTime
      className={`fnb-date-time-picker ${className}`}
      placeholder={placeholder ?? t("form.dateTimePickerPlaceholder")}
      suffixIcon={<DateTimePickerIcon />}
      onChange={onChangeDateTime}
      onOk={onOk}
      showSecond={showSecond}
      format={DateFormat.HH_MM_DD_MM_YYYY_}
      dropdownClassName={"fnb-date-time-picker-dropdown"}
      disabledDate={disabledDate}
      showNow={showNowValue}
      showToday={showToday}
      value={dateTimeChangeValue ?? defaultDateTimeValue}
      onSelect={onSelect}
      allowClear={false}
    />
  );
}
