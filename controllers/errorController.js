// import AppError from "../utils/appError";
export default (err, req, res, next) => {
  const { statusCode = 500, message = "something went wrong!" } = err;
  if (!err.message) err.message = "something went wrong!";
  res.status(statusCode).render("error", { err });
};
