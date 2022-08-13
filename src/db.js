import config from "./config.json";
import { Sequelize } from "sequelize";

export default (callback) => {
  // 从配置文件读取db配置
  let dbConfig = config.db;

  // 初始化并连接数据库
  const sequelize = new Sequelize(
    dbConfig.dbname,
    dbConfig.user,
    dbConfig.password,
    {
      host: dbConfig.host,
      dialect: dbConfig.dialect,
    }
  );

  // 返回数据实例
  callback(sequelize);
};
