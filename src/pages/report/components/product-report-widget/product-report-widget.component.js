import { useTranslation } from "react-i18next";
import "./product-report-widget.component.scss";

/**
 * Product report widget component
 * @param {*} props
 * {
 *  data = { icon, title, description, value, totalOrder, average },
 *  width
 *  description
 * };
 */
export function ProductReportWidgetComponent(props) {
  const [t] = useTranslation();
  const { data, width, description } = props;

  return (
    <>
      <div className="report-widget" style={{ width: width }}>
        <div className="report-widget-wrapper">
          <div className="icon">{data?.icon}</div>
          <div className="title">{t("report.product.totalSoldItem")}</div>
          <div className="description">{description}</div>
          <div className="value">{data?.value ?? 0}</div>
          <div className="footer">
            <div className="f-row">
              <div>{t("order.totalOrder")}</div>
              <div>{data?.totalOrder ?? 0}</div>
            </div>
            <div className="f-row">
              <div>{t("report.product.average")}</div>
              <div>
                <span className="average-value">{data?.average ?? ""}</span>
                {t("report.product.itemPerOrder")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
