import React, { useState } from "react";
import { Tooltip, Typography } from "antd";
const { Paragraph } = Typography;

export default function TooltipParagraph(props) {
  const { children, ellipsis } = props;

  const [truncated, setTruncated] = useState(false);

  return (
    <Tooltip title={truncated ? children : undefined} color="#50429B">
      <Paragraph {...props} ellipsis={{ ...ellipsis, onEllipsis: setTruncated }}>
        <>{children}</>
      </Paragraph>
    </Tooltip>
  );
}
