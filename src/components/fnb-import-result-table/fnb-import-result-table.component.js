import { Row, Typography } from "antd";
import { FnbTable } from "components/fnb-table/fnb-table";
import { WarningIcon } from "constants/icons.constants";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

export function FnbImportResultTable(props) {
  const { dataSource, columns, isSuccess, tableName } = props;
  const [t] = useTranslation();

  const pageData = {
    maximumFileSize: t("material.import.maximumFileSize"),
    importSuccess: t("messages.importSuccess"),
    importErrorMessage: t("messages.importErrorMessage"),
  };

  return (
    <>
      <div className="fnb-import-result-table">
        <div className="message-box-header">
          {isSuccess === false && (
            <>
              <WarningIcon className="message-box-header-warning-icon" />
              <Text type="danger">
                <span
                  dangerouslySetInnerHTML={{
                    __html: t(pageData.importErrorMessage, { name: tableName }),
                  }}
                ></span>
              </Text>
            </>
          )}
          {isSuccess === true && <Text type="success">{pageData.importSuccess}</Text>}
        </div>
        {(isSuccess === false || isSuccess === true) && (
          <Row>
            <FnbTable columns={columns} dataSource={dataSource} className="w-100" />
          </Row>
        )}
      </div>
    </>
  );
}
