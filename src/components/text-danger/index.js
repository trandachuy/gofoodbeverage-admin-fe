import React from "react";
import { Typography } from "antd";
const { Text } = Typography;

export default function TextDanger(props) {
  return (
    <>
      {props.visible && (
        <Text className={props?.className} type="danger">
          {props.text}
        </Text>
      )}
    </>
  );
}
