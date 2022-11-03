import http from "../../utils/http-common";

const controller = "inventory";

const getInventoryHistoryManagementsAsync = (
  pageNumber,
  pageSize,
  keySearch,
  branchId,
  action,
  materialId,
  isActive,
  startDate,
  endDate
) => {
  return http.get(
    `/${controller}/get-all-inventory-history?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}&branchId=${branchId}&action=${action}&materialId=${materialId}&isActive=${isActive}&startDate=${startDate}&endDate=${endDate}`
  );
};

const inventoryHistoryDataService = {
  getInventoryHistoryManagementsAsync,
};
export default inventoryHistoryDataService;
