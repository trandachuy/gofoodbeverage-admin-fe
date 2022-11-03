import { Card } from "antd";
import React from "react";
import "./fnb-card.component.scss";

export default function FnbCard({ title, current, className, onChange, children }) {
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
    <Card className={`fnb-card cart-with-no-border ${className}`}>
      {title && <h2 className="fnb-card-title">{title}</h2>}
      {renderChildren()}
    </Card>
  );
}
