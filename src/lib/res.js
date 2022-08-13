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
  if (errType && errorCode.hasOwnProperty(errType)) {
    let httpstatus = errorCode[errType].httpstatus
      ? errorCode[errType].httpstatus
      : 500;
    resData.code = errorCode[errType].code;
    resData.message = errorCode[errType].message;

    res.status(httpstatus).json(resData);
  } else {
    // 成功，则将数据返回给客户端
    res.status(200).json(resData);
  }
}
