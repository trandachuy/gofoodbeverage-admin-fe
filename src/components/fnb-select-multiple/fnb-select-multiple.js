import React from "react";
import { ArrowDown, CheckboxCheckedIcon } from "constants/icons.constants";
import { Select } from "antd";
import "./fnb-select-multiple.scss";

/**
 * SelectMultiple component custom from antd select
 * @param {option, onChange, className, value, disabled, allowClear, showSearch, placeholder, dropdownRender, style, defaultValue } props
 * option: data select option [], map data [{id: "key", name: "value"}] first
 * other param are used as same as antd select, visit link https://ant.design/components/select/
 * @returns
 */
export function FnbSelectMultiple(props) {
  const {
    value,
    onChange,
    className,
    option,
    disabled,
    allowClear,
    showSearch,
    placeholder,
    dropdownRender,
    style,
    defaultValue,
    onSelect,
  } = props;

  return (
    <>
      <Select
        getPopupContainer={(trigger) => trigger.parentNode}
        mode="multiple"
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        onSelect={onSelect}
        style={style}
        className={`fnb-select-multiple ${className}`}
        dropdownClassName="fnb-select-multiple-dropdown"
        suffixIcon={<ArrowDown />}
        menuItemSelectedIcon={<CheckboxCheckedIcon />}
        disabled={disabled}
        showSearch={showSearch}
        allowClear={allowClear}
        placeholder={placeholder}
        dropdownRender={dropdownRender}
        optionFilterProp="children"
        showArrow
        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {option?.map((item) => (
          <Select.Option key={item.id} value={item.id}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    </>
  );
}
