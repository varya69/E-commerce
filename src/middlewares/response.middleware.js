const sendResponseMiddleware = (req, res, next) => {
  res.sendResponse = (data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({ message, data });
  };
  next();
};

module.exports = sendResponseMiddleware;
