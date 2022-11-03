export const InventoryHistoryAction = {
  /// <summary>
  /// Create Order
  /// </summary>
  CreateOrder: 0,

  /// <summary>
  /// Edit Order
  /// </summary>
  EditOrder: 1,

  /// <summary>
  /// Cancel Order
  /// </summary>
  CancelOrder: 2,

  /// <summary>
  /// Update Stock
  /// </summary>
  UpdateStock: 3,

  /// <summary>
  /// Import Goods
  /// </summary>
  ImportGoods: 4,

  /// <summary>
  /// Transfer Goods
  /// </summary>
  TransferGoods: 5,

  /// <summary>
  /// Start Shift
  /// </summary>
  StartShift: 6,

  /// <summary>
  /// End Shift
  /// </summary>
  EndShift: 7,
};

export const ListInventoryHistoryAction = [
  {
    id: 0,
    name: "CreateOrder",
  },
  {
    id: 1,
    name: "EditOrder",
  },
  {
    id: 2,
    name: "CancelOrder",
  },
  {
    id: 3,
    name: "UpdateStock",
  },
  {
    id: 4,
    name: "ImportGoods",
  },
  {
    id: 5,
    name: "TransferGoods",
  },
  {
    id: 6,
    name: "StartShift",
  },
  {
    id: 7,
    name: "EndShift",
  },
];
