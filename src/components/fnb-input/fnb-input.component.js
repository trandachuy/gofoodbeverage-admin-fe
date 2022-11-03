import { Input } from "antd";
import "./fnb-input.component.scss";

export function FnbInput({ id, value, showCount, className, placeholder, maxLength, onChange }) {
  return (
    <Input
      id={id}
      value={value}
      onChange={onChange}
      className={`fnb-input-customize ${className}`}
      showCount={showCount}
      placeholder={placeholder}
      maxLength={maxLength}
    />
  );
}
