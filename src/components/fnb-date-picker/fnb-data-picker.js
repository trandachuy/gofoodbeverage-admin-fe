import { Button, Popover, Radio, Row } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
// import { DateRange } from "react-date-range";
import { CalendarIcon, DownIcon } from "constants/icons.constants";
import { OptionDateTime } from "constants/option-date.constants";
import moment from "moment";
import * as locales from "react-date-range/dist/locale";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import languageService from "services/language/language.service";
import { DateRange } from "../fnb-date-range-picker";
import "./fnb-data-picker.scss";

export function FnbDatePicker(props) {
  const [t] = useTranslation();
  const pageData = {
    optionDatetime: {
      today: t("optionDatetime.today"),
      yesterday: t("optionDatetime.yesterday"),
      thisWeek: t("optionDatetime.thisWeek"),
      lastWeek: t("optionDatetime.lastWeek"),
      thisMonth: t("optionDatetime.thisMonth"),
      lastMonth: t("optionDatetime.lastMonth"),
      thisYear: t("optionDatetime.thisYear"),
      customize: t("optionDatetime.customize"),
      to: t("optionDatetime.to"),
    },
    cancel: t("button.cancel"),
    apply: t("button.apply"),
  };
  const { selectedDate, setSelectedDate, setConditionCompare } = props;
  const [visible, setVisible] = useState(false);
  const [activeOptionDate, setActiveOptionDate] = useState(0);
  const [localeDateString, setLocaleDateString] = useState("en-US");
  const [selectionRange, setSelectionRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const radioOptionDate = () => {
    const locale = languageService.getLang();
    let startToday = moment().toDate();
    let endToday = moment().toDate();

    let startYesterday = moment().toDate();
    startYesterday.setDate(startYesterday.getDate() - 1);
    let endYesterday = moment().toDate();
    endYesterday.setDate(endYesterday.getDate() - 1);

    let startThisWeek = moment().startOf("week").toDate();
    startThisWeek.setDate(startThisWeek.getDate());
    let endThisWeek = moment().endOf("week").toDate();
    endThisWeek.setDate(endThisWeek.getDate());

    let startLastWeek = moment().startOf("week").toDate();
    startLastWeek.setDate(startLastWeek.getDate() - 7);
    let endLastWeek = moment().endOf("week").toDate();
    endLastWeek.setDate(endLastWeek.getDate() - 7);

    let startThisMonth = moment().startOf("month").toDate();
    let endThisMonth = moment().endOf("month").toDate();

    let toDate = moment().toDate();
    let startLastMonth = new Date(toDate.getFullYear(), toDate.getMonth() - 1, 1);
    let endLastMonth = new Date(toDate.getFullYear(), toDate.getMonth(), 0);

    let startThisYear = moment().startOf("year").toDate();
    let endThisYear = moment().endOf("year").toDate();

    const listOptionDateTime = [
      {
        key: 0,
        name: pageData.optionDatetime.today,
        disabled: false,
        startDate: startToday,
        endDate: endToday,
      },
      {
        key: 1,
        name: pageData.optionDatetime.yesterday,
        disabled: false,
        startDate: startYesterday,
        endDate: endYesterday,
      },
      {
        key: 2,
        name: pageData.optionDatetime.thisWeek,
        disabled: false,
        startDate: startThisWeek,
        endDate: endThisWeek,
      },
      {
        key: 3,
        name: pageData.optionDatetime.lastWeek,
        disabled: false,
        startDate: startLastWeek,
        endDate: endLastWeek,
      },
      {
        key: 4,
        name: pageData.optionDatetime.thisMonth,
        disabled: false,
        startDate: startThisMonth,
        endDate: endThisMonth,
      },
      {
        key: 5,
        name: pageData.optionDatetime.lastMonth,
        disabled: false,
        startDate: startLastMonth,
        endDate: endLastMonth,
      },
      {
        key: 6,
        name: pageData.optionDatetime.thisYear,
        disabled: false,
        startDate: startThisYear,
        endDate: endThisYear,
      },
      {
        key: 7,
        name: pageData.optionDatetime.customize,
        disabled: true,
        startDate: startToday,
        endDate: endToday,
      },
    ];

    return listOptionDateTime;
  };

  const onClickToday = (e) => {
    const optionChecked = e.target.value;
    const optionDate = radioOptionDate();
    const selectedOption = optionDate.find((item) => item.key === optionChecked);

    let selectedDate = {
      startDate: selectedOption.startDate,
      endDate: selectedOption.endDate,
      key: "selection",
    };

    const typeOptionDate = selectedOption.key;
    setActiveOptionDate(typeOptionDate);
    setConditionCompare(optionChecked);
    setSelectionRange([selectedDate]);
    onSetDatetime([selectedDate], typeOptionDate);
  };

  const onChangeDateRange = (item) => {
    setSelectionRange([item.selection]);

    const selectedDate = {
      startDate: item.selection.startDate,
      endDate: item.selection.endDate,
    };

    const optionDate = radioOptionDate();
    let selectedOption = optionDate.find(
      (item) =>
        item.startDate.toLocaleDateString(localeDateString) ===
          selectedDate.startDate.toLocaleDateString(localeDateString) &&
        item.endDate.toLocaleDateString(localeDateString) === selectedDate.endDate.toLocaleDateString(localeDateString)
    );

    let optionKey = 7;
    if (selectedOption) {
      optionKey = selectedOption.key;
    }

    switch (optionKey) {
      case OptionDateTime.today:
        setActiveOptionDate(OptionDateTime.today);
        break;
      case OptionDateTime.yesterday:
        setActiveOptionDate(OptionDateTime.yesterday);
        break;
      case OptionDateTime.thisWeek:
        setActiveOptionDate(OptionDateTime.thisWeek);
        break;
      case OptionDateTime.lastWeek:
        setActiveOptionDate(OptionDateTime.lastWeek);
        break;
      case OptionDateTime.thisMonth:
        setActiveOptionDate(OptionDateTime.thisMonth);
        break;
      case OptionDateTime.lastMonth:
        setActiveOptionDate(OptionDateTime.lastMonth);
        break;
      case OptionDateTime.thisYear:
        setActiveOptionDate(OptionDateTime.thisYear);
        break;
      default:
        setActiveOptionDate(OptionDateTime.customize);
        break;
    }
  };

  const onSetDatetime = (startEndDate, typeOptionDate) => {
    let startDate = startEndDate[0]?.startDate?.toLocaleString(localeDateString);
    let endDate = startEndDate[0]?.endDate?.toLocaleString(localeDateString);
    let date = {
      startDate: startDate,
      endDate: endDate,
    };
    setSelectedDate(date, typeOptionDate);
    setVisible(false);
  };

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  const getDatetime = () => {
    switch (activeOptionDate) {
      case OptionDateTime.today:
        return pageData.optionDatetime.today;
      case OptionDateTime.yesterday:
        return pageData.optionDatetime.yesterday;
      case OptionDateTime.thisWeek:
        return pageData.optionDatetime.thisWeek;
      case OptionDateTime.lastWeek:
        return pageData.optionDatetime.lastWeek;
      case OptionDateTime.thisMonth:
        return pageData.optionDatetime.thisMonth;
      case OptionDateTime.lastMonth:
        return pageData.optionDatetime.lastMonth;
      case OptionDateTime.thisYear:
        return pageData.optionDatetime.thisYear;
      default:
        return `${selectedDate?.startDate} - ${selectedDate?.endDate}`;
    }
  };

  /// The date picker locale support list
  ///af, arDZ, arSA, be, bg, bn, ca, cs, cy, da, de, el, enAU, enCA, enGB, enUS, eo, es, et, faIR, fi, fr, frCA, gl, gu, he, hi, hr, hu, hy, id, is, it, ja, ka, kk, ko, lt, lv, ms, nb, nl, nn, pl, pt, ptBR, ro, ru, sk, sl, sr, srLatn, sv, ta, te, th, tr, ug, uk, vi, zhCN, zhTW
  const getDatePickerLocale = () => {
    var lang = languageService.getLang();
    switch (lang) {
      case "vi":
        setLocaleDateString("en-US");
        return "vi";
      case "en":
      default:
        setLocaleDateString("en-US");
        return "enUS";
    }
  };

  const content = () => {
    return (
      <div>
        <div className="fnb-form-picker">
          <Row className="fnb-form-option-date">
            <Radio.Group value={activeOptionDate} onChange={onClickToday}>
              {radioOptionDate().map((item) => {
                return (
                  <Radio.Button
                    disabled={item?.disabled}
                    value={item.key}
                    className={`fnb-btn-date ${item?.disabled && "fnb-btn-date-disable"}`}
                  >
                    {item.name}
                  </Radio.Button>
                );
              })}
            </Radio.Group>
          </Row>
          <Row className="fnb-form-picker">
            <Row>
              <DateRange
                moveRangeOnFirstSelection={false}
                ranges={selectionRange}
                onChange={(item) => onChangeDateRange(item)}
                months={2}
                locale={locales[getDatePickerLocale()]}
                direction="horizontal"
                showMonthAndYearPickers={true}
              />
            </Row>
          </Row>
        </div>
        <Row className="fnb-footer">
          <div className="fnb-footer-div">
            {selectionRange[0]?.startDate?.toLocaleDateString(localeDateString) ===
            selectionRange[0]?.endDate?.toLocaleDateString(localeDateString) ? (
              <p className="fnb-text-date">{selectionRange[0]?.startDate?.toLocaleDateString(localeDateString)}</p>
            ) : (
              <Row className="fnb-date-to-date-wrapper">
                <span className="fnb-text-start-date">
                  {selectionRange[0]?.startDate?.toLocaleDateString(localeDateString)}
                </span>
                <span className="fnb-text-to-date">{pageData.optionDatetime.to}</span>
                <span className="fnb-text-end-date">
                  {selectionRange[0]?.endDate?.toLocaleDateString(localeDateString)}
                </span>
              </Row>
            )}
          </div>
          <div className="fnb-form-btn">
            <Button className="fnb-btn-cancel" onClick={() => setVisible(false)}>
              {pageData.cancel}
            </Button>
            <Button className="fnb-btn-apply" onClick={() => onSetDatetime(selectionRange, OptionDateTime.customize)}>
              {pageData.apply}
            </Button>
          </div>
        </Row>
      </div>
    );
  };

  return (
    <Popover
      placement="bottom"
      visible={visible}
      overlayClassName="fnb-popver-picker"
      onVisibleChange={handleVisibleChange}
      content={content}
      trigger="click"
    >
      <Button className="btn-date-picker">
        <div className="fnb-btn-div-icon-calendar">
          <CalendarIcon />
        </div>
        <div className="fnb-div-text-date-time">
          <p className="fnb-text-date-time">{getDatetime()}</p>
        </div>
        <div className="fnb-div-down">
          <DownIcon className="fnb-icon-down" />
        </div>
      </Button>
    </Popover>
  );
}
