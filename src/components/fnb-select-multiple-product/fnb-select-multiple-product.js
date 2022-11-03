import React from "react";
import { ArrowDown } from "constants/icons.constants";
import { Image, Select } from "antd";
import "./fnb-select-multiple-product.scss";
import productDefaultImage from "../../assets/images/combo-default-img.jpg";

/**
 * SelectMultiple component custom from antd select
 * @param {option, onChange, className, value, disabled, allowClear, showSearch, placeholder, dropdownRender, style, defaultValue } props
 * option: data select option [], map data [{id: "key", name: "value"}] first
 * other param are used as same as antd select, visit link https://ant.design/components/select/
 * @returns
 */
export function FnbSelectMultipleProduct(props) {
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
    listHeight
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
        className={`fnb-select-multiple-product ${className}`}
        dropdownClassName="fnb-select-multiple-product-dropdown"
        suffixIcon={<ArrowDown />}
        menuItemSelectedIcon
        disabled={disabled}
        showSearch={showSearch}
        allowClear={allowClear}
        placeholder={placeholder}
        listHeight={listHeight}
        dropdownRender={dropdownRender}
        optionFilterProp="children"
        optionLabelProp="label"
        showArrow
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {option?.map((item) => (
          <Select.Option key={item?.id} value={item?.id} label={item?.name}>
            <div className="product-option-box">
              <div className="img-box">
                <Image
                  preview={false}
                  src={item?.thumbnail ?? "error"}
                  fallback={productDefaultImage}
                />
              </div>
              <span className="product-name">{item?.name}</span>
            </div>
          </Select.Option>
        ))}
      </Select>
    </>
  );
}
