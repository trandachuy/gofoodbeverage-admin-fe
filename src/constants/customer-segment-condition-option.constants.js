import {
  monthsInYear,
  objectiveEnum,
  customerDataEnum,
  registrationDateConditionEnum,
} from "./customer-segment-condition.constants";

export const objectiveOptions = [
  {
    id: objectiveEnum.customerData,
    name: "customerSegment.condition.customerData",
  },

  /**
   * We will implement objective OrderData later
   */
  // {
  //   id: objectiveEnum.orderData,
  //   name: "customerSegment.condition.orderData",
  // },
];

export const customerDataOptions = [
  {
    id: customerDataEnum.registrationDate,
    name: "customerSegment.condition.registrationDate",
  },
  {
    id: customerDataEnum.birthday,
    name: "customerSegment.condition.birthday",
  },
  {
    id: customerDataEnum.gender,
    name: "customerSegment.condition.gender",
  },
  {
    id: customerDataEnum.tag,
    name: "customerSegment.condition.tag",
  },
];

export const registrationDateConditionOptions = [
  {
    id: registrationDateConditionEnum.on,
    name: "customerSegment.condition.on",
  },
  {
    id: registrationDateConditionEnum.before,
    name: "customerSegment.condition.before",
  },
  {
    id: registrationDateConditionEnum.after,
    name: "customerSegment.condition.after",
  },
];

export const monthsInYearOptions = [
  {
    id: monthsInYear.jan,
    name: "customerSegment.condition.month.january",
  },
  {
    id: monthsInYear.feb,
    name: "customerSegment.condition.month.february",
  },
  {
    id: monthsInYear.mar,
    name: "customerSegment.condition.month.march",
  },
  {
    id: monthsInYear.apr,
    name: "customerSegment.condition.month.april",
  },
  {
    id: monthsInYear.may,
    name: "customerSegment.condition.month.may",
  },
  {
    id: monthsInYear.jun,
    name: "customerSegment.condition.month.june",
  },
  {
    id: monthsInYear.jul,
    name: "customerSegment.condition.month.july",
  },
  {
    id: monthsInYear.aug,
    name: "customerSegment.condition.month.august",
  },
  {
    id: monthsInYear.sep,
    name: "customerSegment.condition.month.september",
  },
  {
    id: monthsInYear.oct,
    name: "customerSegment.condition.month.october",
  },
  {
    id: monthsInYear.nov,
    name: "customerSegment.condition.month.november",
  },
  {
    id: monthsInYear.dec,
    name: "customerSegment.condition.month.december",
  },
];
