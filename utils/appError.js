class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // we set the message property into the Error class
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.statusCode = statusCode;
  }
}

export default AppError;
