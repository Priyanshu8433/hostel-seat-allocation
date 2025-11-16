export default function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err)

  // If the error has a statusCode (ApiError), use it
  if (err && err.statusCode) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      success: false,
      message: err.message || 'Error',
      errors: err.errors || []
    })
  }

  // Fallback for unexpected errors
  console.error(err)
  res.status(500).json({ statusCode: 500, success: false, message: err.message || 'Internal Server Error' })
}
