class AppError extends Error {
  statusCode: any
  status: string
  isOperational: boolean
  constructor(message: string | undefined, statusCode: any) {
    super(message)

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    // types of error ['programming' or 'operational']
    this.isOperational = true

    // line in that error occurs
    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError
