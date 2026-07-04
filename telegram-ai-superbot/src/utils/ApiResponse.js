export const ApiResponse = {
  success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  },

  created(res, data = null, message = 'Created successfully') {
    return this.success(res, data, message, 201);
  },

  error(res, message = 'Internal server error', statusCode = 500, code = 'INTERNAL_ERROR') {
    return res.status(statusCode).json({
      success: false,
      message,
      code,
      timestamp: new Date().toISOString(),
    });
  },

  paginated(res, data, pagination, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination,
      timestamp: new Date().toISOString(),
    });
  },
};
