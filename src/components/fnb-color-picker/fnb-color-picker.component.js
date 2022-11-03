import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";

export const FnbColorPicker = ({ className, onChange, hexColor }) => {
  const defaultColor = "#50429B";
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [colorSelected, setColorSelected] = useState(hexColor ?? defaultColor);

  useEffect(() => {
    onChangeColor({ hex: hexColor });
  }, []);

  const onOpenColorPicker = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const onCloseColorPicker = () => {
    setDisplayColorPicker(false);
  };

  const onChangeColor = (color) => {
    setColorSelected(color.hex);
    if (onChange) {
      onChange(color);
    }
  };

  const styles = reactCSS({
    default: {
      color: {
        width: "60px",
        height: "36px",
        borderRadius: "2px",
        background: `${hexColor ?? colorSelected.hex}`,
      },
      swatch: {
        background: "#fff",
        borderRadius: "1px",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        display: "inline-block",
        cursor: "pointer",
      },
      popover: {
        position: "absolute",
        zIndex: "2",
      },
      cover: {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    },
  });

  return (
    <>
      <div className={className}>
        <div className="fnb-color-picker" style={styles.swatch} onClick={onOpenColorPicker}>
          <div style={styles.color} />
        </div>
        {displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={onCloseColorPicker} />
            <SketchPicker color={colorSelected} onChange={onChangeColor} />
          </div>
        ) : null}
      </div>
    </>
  );
};
