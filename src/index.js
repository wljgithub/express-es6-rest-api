import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import initializeDb from "./db";
import middleware from "./middleware";
import api from "./api";
import config from "./config.json";
import { initDataModels } from "./models/user";

// 初始化express框架
let app = express();

// 加载日志插件
app.use(
  morgan(
    `:date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms`
  )
);

// 加载json解析插件
app.use(
  bodyParser.json({
    limit: config.bodyLimit,
  })
);

// 加载第三方中间件
app.use(
  cors({
    exposedHeaders: config.corsHeaders,
  })
);

// 连接数据库
initializeDb((db) => {
  // 注册所有model
  initDataModels(db);

  // 加载自定义中间件
  app.use(middleware({ config, db }));

  // 注册所有api 路由
  app.use("/api", api({ config, db }));

  // 启动服务器
  let listener = app.listen(process.env.PORT || config.port, () => {
    console.log(`Started on port ${listener.address().port}`);
  });
});

export default app;
