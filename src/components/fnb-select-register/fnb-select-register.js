import React from "react";
import { ArrowDown, CheckedIcon, WorldIcon } from "constants/icons.constants";
import { Select } from "antd";
import "./fnb-select-register.scss";

/**
 * SelectRegister component custom from antd select
 * @param {option, value, onChange, className, disabled, allowClear, showSearch, placeholder, dropdownRender, style, defaultValue } props
 * option: data select option [], map data [{id: "key", name: "value"}] first
 * other param are used as same as antd select, visit link https://ant.design/components/select/
 * @returns
 */

export function FnbSelectRegister(props) {
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
    labelOption,
    onSearch,
    searchValue,
  } = props;

  return (
    <>
      <Select
        getPopupContainer={(trigger) => trigger.parentNode}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        style={style}
        onSearch={onSearch}
        searchValue={searchValue}
        className={`fnb-select-register ${className}`}
        dropdownClassName="fnb-select-register-dropdown"
        suffixIcon={<ArrowDown />}
        menuItemSelectedIcon={<CheckedIcon />}
        disabled={disabled}
        showSearch={showSearch}
        allowClear={allowClear}
        placeholder={placeholder}
        dropdownRender={dropdownRender}
        optionFilterProp="children"
        optionLabelProp="label"
        showArrow
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {option?.map((item) => (
          <Select.Option
            key={item.id}
            value={item.id}
            label={
              <>
                {labelOption} <span className={labelOption && "ml-2"}> {item.name} </span>
              </>
            }
          >
            {item.name}
          </Select.Option>
        ))}
      </Select>
    </>
  );
}
