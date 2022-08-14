export const USER_EXISTS = "USER_EXISTS";
export const INTERNAL_SERVER_ERR = "INTERNAL_SERVER_ERR";

export const errorCode = {
  // 通用错误
  INTERNAL_SERVER_ERR: { httpstatus: 500, code: 5000, message: "服务内部错误" },

  // 用户相关错误
  USER_EXISTS: { httpstatus: 400, code: 1001, message: "用户已存在" },
};
