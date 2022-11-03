import { Tooltip } from "antd";
import { BookGuidelineIcon, PromotionGuidelineIcon } from "constants/icons.constants";
import "./fnb-guideline.component.scss";

export function FnbGuideline({ placement, title, content }) {
  const titleTooltip = (title, content) => {
    return (
      <div className="guideline-wrapper">
        <div className="guideline-header">
          <span className="icon">
            <BookGuidelineIcon />
          </span>
          {title}
        </div>
        <p className="guideline-content" dangerouslySetInnerHTML={{ __html: content }}></p>
      </div>
    );
  };

  return (
    <Tooltip overlayClassName="fnb-guideline" placement={placement} title={titleTooltip(title, content)}>
      <PromotionGuidelineIcon />
    </Tooltip>
  );
}
