import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./fnb-tabs.scss";

/**
 * Fnb Tabs
 * @param {[pane]} props
 * pane = {key, icon, title, extractData, component}
 * @returns
 */
export function FnbTabs(props) {
  const { t } = useTranslation();
  const { defaultActiveKey, className, onClick, panes, onChangeTab, location } = props;
  const [currentKey, setCurrentKey] = React.useState(defaultActiveKey);
  const [currentComponent, setCurrentComponent] = React.useState(defaultActiveKey);

  const tabs = {
    permissionGroup: 2,
  };

  useEffect(() => {
    const pane = panes.find((pane) => pane.key === defaultActiveKey);
    if (pane) {
      setCurrentComponent(pane?.component);
    }
    if (location?.state != undefined && location?.state?.tabPermissionGroup === tabs.permissionGroup) {
      onChange(tabs.permissionGroup);
    } else {
      setCurrentKey(defaultActiveKey);
    }
  }, []);

  const onChange = (key) => {
    if (onClick) onClick();

    const pane = panes.find((pane) => pane.key === key);
    if (pane) {
      setCurrentComponent(pane?.component);
    }
    setCurrentKey(key);

    if (onChangeTab) {
      onChangeTab(key);
    }
  };

  const renderTabPane = () => {
    const renderPanesHeader = panes?.map((pane, index) => {
      const { key, icon, title, extract } = pane;
      return (
        <li key={index} className={key === currentKey ? "tab-current" : ""} onClick={() => onChange(key)}>
          <a href="javascript:void(0)" key={index} className="header">
            <div className="icon" key={index}>
              {icon} <span>{t(title)}</span>
            </div>
          </a>
        </li>
      );
    });

    return renderPanesHeader;
  };

  return (
    <div className={`${className ?? ""}`}>
      <div className={"fnb-tabs fnb-tabs-style-tzoid"}>
        <nav>
          <ul>{renderTabPane()}</ul>
        </nav>
      </div>
      <div className="current-tab-body">{currentComponent}</div>
    </div>
  );
}
