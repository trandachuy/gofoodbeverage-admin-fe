import { InputNumber } from "antd";
import { currency } from "constants/string.constants";
import { useSelector } from "react-redux";

import "./fnb-input-currency.component.scss";

export function FnbInputCurrency({ id, value, min, max, addonAfter, onChange, placeholder }) {
  const state = useSelector((state) => state);
  const { storeInfo } = state?.session;

  const getPrecision = () => {
    return currency.vnd?.toLowerCase() === storeInfo?.currencyCode?.toString().toLowerCase() ? 0 : 2;
  };

  return (
    <div className="fnb-input-currency">
      <InputNumber
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        addonAfter={addonAfter ?? storeInfo?.currencyCode}
        className="input-currency"
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        precision={getPrecision()}
        max={max}
        min={min}
      />
    </div>
  );
}
