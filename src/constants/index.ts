export const MODULE = {
    DASHBOARD: 1,
    PRODUCT: 2,
    ORDER: 3,
    USER: 4,
    CONFIG: 5,
    CONTACT: 6,
    NEWS: 7,
  };

export const MODE_THEME = {
  DARK: 'dark',
  LIGHT: 'light',
}

export const GLOBAL_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
};

export const MASTER_DATA = [
  {value: 1, nameMaster: "Tình trạng đơn hàng"},
  {value: 2, nameMaster: "Cấp bậc người dùng"},
  {value: 3, nameMaster: "Đơn vị sản phẩm"},
  {value: 4, nameMaster: "Dung tích sản phẩm"},
  {value: 5, nameMaster: "Phân quyền"},
  {value: 6, nameMaster: "Điều kiện tăng cấp bậc"},
  {value: 7, nameMaster: "Phần trăm cho người giới thiệu"},
  {value: 8, nameMaster: "Nhà sản xuất"},
];

export const MASTER_DATA_NAME = {
  STATUS_ORDER: 1,
  LEVEL_USER: 2,
  UNIT_PRODUCT: 3,
  CAPACITY_PRODUCT: 4,
  ROLE: 5,
  CONDITIONS_LEVEL: 6,
  PERCENT_REFERRAL: 7,
  ORIGIN: 8,
};

export const IMAGE_TYPE = {
  SUB: 0,
  MAIN: 1
};

export const STATUS_ORDER = {
  CONFIRMIMG:1,
  CONFIRMED:2,
  SHIPPING:3,
  DELIVERED:4,
  REJECT:5
}

export const ACCOUNT_STATUS = {
  ACTIVATE: 1,
  INACTIVATE: 2,
};