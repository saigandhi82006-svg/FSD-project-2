export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for developers
  console.error('[API Error]:', {
    message: err.message,
    path: req.originalUrl,
    method: req.method,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    return res.status(404).json({
      success: false,
      error: message,
      code: 'RESOURCE_NOT_FOUND'
    });
  }

  // Mongoose Duplicate Key (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `An account or record with this ${field} already exists.`;
    return res.status(409).json({
      success: false,
      error: message,
      code: 'DUPLICATE_FIELD',
      field
    });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: messages.join('. '),
      code: 'VALIDATION_ERROR',
      details: messages
    });
  }

  // Multer Error
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'Uploaded file is too large. Maximum size allowed is 5MB.',
        code: 'FILE_TOO_LARGE'
      });
    }
    return res.status(400).json({
      success: false,
      error: `File upload error: ${err.message}`,
      code: 'UPLOAD_ERROR'
    });
  }

  // Default response
  const statusCode = error.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: error.message || 'Server Internal Error',
    code: error.code || 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
