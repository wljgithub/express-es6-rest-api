import { version } from "../../package.json";
import { Router } from "express";
import facets from "./facets";

export default ({ config, db }) => {
  // 初始化路由
  let api = Router();

  // mount the facets resource
  api.use("/facets", facets({ config, db }));

  // perhaps expose some API metadata at the root
  api.get("/", (req, res) => {
    res.json({ version });
  });

  return api;
};
