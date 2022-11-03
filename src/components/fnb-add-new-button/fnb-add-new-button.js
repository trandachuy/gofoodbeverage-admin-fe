import { Button } from "antd";
import { PlusIcon } from "constants/icons.constants";
import { useTranslation } from "react-i18next";
import { capitalizeFirstLetterEachWord, hasPermission } from "utils/helpers";
import "./fnb-add-new-button.scss";

export function FnbAddNewButton({
  className,
  onClick,
  text,
  htmlType,
  permission,
  disabled,
  hideIcon,
  idControl = "btn-add-new",
}) {
  const [t] = useTranslation();
  const renderButton = () => {
    const titleFormatted = capitalizeFirstLetterEachWord(text);
    if (hasPermission(permission)) {
      return (
        <Button
          icon={hideIcon ? <></> : <PlusIcon />}
          className={`fnb-add-new-button ${className ?? ""}`}
          type="primary"
          onClick={onClick}
          htmlType={htmlType}
          disabled={disabled}
          id={idControl}
        >
          <span>{titleFormatted}</span>
        </Button>
      );
    }

    if (!permission) {
      return (
        <Button
          icon={hideIcon ? <></> : <PlusIcon />}
          className={`fnb-add-new-button ${className ?? ""}`}
          type="primary"
          onClick={onClick}
          htmlType={htmlType}
          disabled={disabled}
          id={idControl}
        >
          <span>{titleFormatted}</span>
        </Button>
      );
    }
  };
  return <>{renderButton()}</>;
}
