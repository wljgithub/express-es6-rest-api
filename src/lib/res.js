import { errorCode } from "./errorno";

/**	Creates a callback that proxies node callback style arguments to an Express Response object.
 *	@param {express.Response} res	Express HTTP Response
 *	@param {number} [status=200]	Status code to send on success
 *
 *	@example
 *		list(req, res) {
 *			collection.find({}, toRes(res));
 *		}
 */
// export function toRes(res, status) {
// 	return (err, thing) => {
// 		if (err) return res.status(500).send(err);

// 		if (thing && typeof thing.toObject==='function') {
// 			thing = thing.toObject();
// 		}
// 		res.status(status).json(thing);
// 	};
// }

export function toRes(res, data = {}, errType) {
  let resData = {
    code: 0,
    data: data,
    message: "OK",
  };
  // 如果出错，返回对应的错误信息给客户端
  if (errType) {
    let errorNo = errorCode[errType];
    let httpstatus = errorNo && errorNo.httpstatus ? errorNo.httpstatus : 500;
    resData.code = errorNo && errorNo.code ? errorNo.code : 5000;
    resData.message = errorNo && errorNo.message ? errorNo.message : errType;

    res.status(httpstatus).json(resData);
  } else {
    // 成功，则将数据返回给客户端
    res.status(200).json(resData);
  }
}
