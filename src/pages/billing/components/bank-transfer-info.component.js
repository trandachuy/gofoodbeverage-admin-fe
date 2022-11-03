import { t } from "i18next";
import "./bank-transfer-info.component.scss";

export const BankTransferInfoComponent = (props) => {
  const { className, data } = props;

  const pageData = {
    accountOwner: t("package.text.accountOwner"),
    accountNumber: t("package.text.accountNumber"),
    bankName: t("package.text.bankName"),
    branch: t("package.text.branch"),
    content: t("package.text.content"),
  };

  return (
    <div className={`bank-transfer-info ${className ?? ""}`}>
      <div className="info">
        <div className="label">{pageData.accountOwner}:</div>
        <div className="value">{data?.accountHolderName}</div>
      </div>
      <div className="info">
        <div className="label">{pageData.accountNumber}:</div>
        <div className="value">{data?.accountNumber}</div>
      </div>
      <div className="info">
        <div className="label">{pageData.bankName}:</div>
        <div className="value">{data?.bankName}</div>
      </div>
      <div className="info">
        <div className="label">{pageData.branch}:</div>
        <div className="value">{data?.bankBranchName}</div>
      </div>
      <div className="info">
        <div className="label">{pageData.content}:</div>
        <div className="value">{data?.content}</div>
      </div>
    </div>
  );
};
