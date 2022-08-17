import { version } from "../../package.json";
import { Router } from "express";
import facets from "./facets";
import user from "./user";
import { loginValidate, registerValidate } from "./validation/user";
import { dbbrain } from "tencentcloud-sdk-nodejs";
const { query, checkSchema } = require("express-validator");

export default ({ config, db }) => {
  // 初始化路由
  let api = Router();

  // mount the facets resource
  api.use("/facets", facets({ config, db }));

  // perhaps expose some API metadata at the root
  api.get("/", (req, res) => {
    res.json({ version });
  });

  // 用户相关接口
  api.get("/user/email-code", query("email").isEmail(), user.getEmailCode);
  api.post("/user/register", checkSchema(registerValidate), user.register(db));
  api.post("/user/login", checkSchema(loginValidate), user.login(db));
  api.get("/user/captcha", user.getCaptcha);
  return api;
};
