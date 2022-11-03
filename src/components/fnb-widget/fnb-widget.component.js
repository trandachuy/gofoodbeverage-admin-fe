import { Row, Col, Typography } from "antd";
import { TriangleReduceIcon, TriangleIncreaseIcon } from "constants/icons.constants";
import "./fnb-widget.component.scss";

const { Paragraph } = Typography;

export const FnBWidget = (props) => {
  const { title, icon, value, description, isIncrease, ellipsis, className } = props;
  return (
    <>
      <div className={`group-business ${className ?? ""}`}>
        <div className="information">
          <div className="widget-icon">{icon}</div>
          <div className="content">
            <span className="widget-title">{title}</span>
            <div className="widget-detail">
              {isIncrease === true ? (
                <>
                  <TriangleIncreaseIcon className="triangle-icon" />
                  <Paragraph
                    className="label"
                    ellipsis={{
                      rows: 1,
                      expandable: false,
                      symbol: "",
                      tooltip: description,
                    }}
                  >
                    {description}
                  </Paragraph>
                </>
              ) : (
                <>
                  <TriangleReduceIcon className="triangle-icon" />
                  <Paragraph
                    className="label"
                    ellipsis={{
                      rows: 1,
                      expandable: false,
                      symbol: "",
                      tooltip: description,
                    }}
                  >
                    {description}
                  </Paragraph>
                </>
              )}
            </div>
            <div className="footer">{value}</div>
          </div>
        </div>
      </div>
    </>
  );
};
