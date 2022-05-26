import AppError from './appError'

const handleCastErrorDB = (err: { path: any; value: any }) => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 404)
}
const handleDuplicateFieldsDB = (err: {
  errmsg: { match: (arg0: RegExp) => any[] }
}) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  const message = `Duplicate field value: ${value}. Please use another value!`
  return new AppError(message, 400)
}
const handleValidationErrorDB = (err: {
  errors: { [s: string]: unknown } | ArrayLike<unknown>
}) => {
  const errors = Object.values(err.errors).map((el: any) => el.message)

  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401)

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401)

const sendErrorDev = (err: any, res: any) => {
  res.status(err.statusCode).json({
    errors: [{ message: err.message }]
  })
  /* status: err.status,
  error: err,
  message: err.message,
  stack: err.stack */
}
const sendErrorProd = (
  err: { isOperational: any; statusCode: any; status: any; message: any },
  res: {
    status: (arg0: number) => {
      (): any
      new (): any
      json: { (arg0: { status: any; message: any }): void; new (): any }
    }
  }
) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })

    // Programming or other unknown error: don't leak error details'
  } else {
    // 1) Log error
    console.error(`ERROR 💥`, err)

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    })
  }
}

const handleUnknownError = () =>
  new AppError('Invalid file. Please try again!', 403)

export default (err: any, _req: any, res: any, _next: any) => {
  // console.log(err.stack)
  console.log(err)
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }
    if (error.name === 'CastError') error = handleCastErrorDB(error)
    if (error.code === 11000) error = handleDuplicateFieldsDB(error)
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
    if (error.name === 'JsonWebTokenError') error = handleJWTError()
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()
    if (error.name === 'unknown error') error = handleUnknownError()

    sendErrorProd(error, res)
  }
}
