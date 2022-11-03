import React, { useState } from "react";
import { Popover, Row, List } from "antd";
import { ViewMoreIcon } from "constants/icons.constants";
import "./fnb-view-more.scss";

export function FnbViewMoreComponent(props) {
  const { title, content, isLink } = props;
  const dataSource = () => {
    return (
      <>
        <div className="fnb-popover-view-more">
          <div className="title-view-more">
            <p>{title}</p>
          </div>
          <div className="data-view-more">
            <div>
              {content?.map((item, index) => {
                return (
                  <div key={index} className="form-item text-overflow">
                    <a href={isLink && `${item?.link}`} className={!isLink && "disabled-link"}>
                      {item?.name}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      <Popover content={dataSource()} trigger="click">
        <a>
          <ViewMoreIcon className="style-icon-view-more" />
        </a>
      </Popover>
    </div>
  );
}
