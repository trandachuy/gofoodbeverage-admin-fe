import React, { useEffect, useState } from "react";
import TooltipParagraph from "components/fnb-tooltip-paragraph/fnb-tooltip-paragraph";

export function FnbTooltip(props) {
  const { text, color, className } = props;
  const [bgColor, setBgColor] = useState("#fff");
  useEffect(() => {
    if (color) {
      setBgColor(color);
    }
  }, []);
  return <TooltipParagraph>{text}</TooltipParagraph>;
}
