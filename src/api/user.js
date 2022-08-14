import { toRes } from "../lib/res";
import AsyncLock from "async-lock";
import { validationResult } from "express-validator";
import { sixRandomDigit } from "../lib/util";
import { sendEmail } from "../lib/tencent-sdk";
import { INTERNAL_SERVER_ERR } from "../lib/errorno";

const emailWithCode = {};

let lock = new AsyncLock();

export default {
  getEmailCode(req, res) {
    // 校验参数格式
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // 接口的逻辑
    let email = req.query.email;

    // 随机生成6个数字
    let sixDigit = sixRandomDigit();

    // 调用外部接口发送邮件验证码
    sendEmail(email, "注册验证码", sixDigit).then(
      // 成功则提示
      () => {
        // 需要记录给谁发了xx验证码，到时候需要校验
        // TODO: 需要考虑并发安全问题
        emailWithCode[email] = sixDigit;
        return toRes(res, { code: sixDigit });
      },
      //   失败则返回错误提示
      (err) => {
        console.error("error", err);
        return toRes(res, {}, INTERNAL_SERVER_ERR);
      }
    );
  },
};
