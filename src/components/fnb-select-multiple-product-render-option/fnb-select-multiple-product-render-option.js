import React from "react";
import { ArrowDown, SelectCheckedIcon } from "constants/icons.constants";
import "./fnb-select-multiple-product-render-option.scss";
import { Select } from "antd";
/**
 * SelectMultiple component custom from antd select
 * @param {selectOption, onChange, className, value, disabled, allowClear, showSearch, placeholder, dropdownRender, style, defaultValue } props
 * selectOption: The select option is a function that you render your select option
 * other param are used as same as antd select, visit link https://ant.design/components/select/
 * @returns
 */
export function FnbSelectMultipleProductRenderOption(props) {
  const {
    value,
    onChange,
    className,
    selectOption,
    disabled,
    placeholder,
    style,
    defaultValue,
    onSelect,
    listHeight,
    onDeselect,
    onClear,
  } = props;

  return (
    <Select
      getPopupContainer={(trigger) => trigger.parentNode}
      showSearch={true}
      optionLabelProp="label"
      mode="multiple"
      showArrow
      allowClear
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      onSelect={onSelect}
      style={style}
      className={`fnb-select-multiple-product-with-group ${className}`}
      dropdownClassName="fnb-select-multiple-product-with-group-dropdown"
      suffixIcon={<ArrowDown />}
      menuItemSelectedIcon={<SelectCheckedIcon />}
      disabled={disabled}
      placeholder={placeholder}
      listHeight={listHeight}
      onDeselect={onDeselect}
      onClear={onClear}
    >
      {selectOption}
    </Select>
  );
}
