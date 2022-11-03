export const PromotionType = {
  /// <summary>
  /// DiscountTotal
  /// </summary>
  DiscountTotal: 0,

  /// <summary>
  /// DiscountProduct
  /// </summary>
  DiscountProduct: 1,

  /// <summary>
  /// In DiscountProductCategory
  /// </summary>
  DiscountProductCategory: 2,
};

export const ListPromotionType = [
  {
    key: 0,
    name: "promotion.discount.total",
  },
  {
    key: 1,
    name: "promotion.discount.product",
  },
  {
    key: 2,
    name: "promotion.discount.productCategory",
  },
];

export const PromotionStatus = {
  Schedule: 1,
  Active: 2,
  Finish: 3,
};
