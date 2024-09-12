class apiError extends Error {
    constructor(
        statusCode,
        message = "something went wrong",
        error = [],
        stack = "",
    ){
        super(message);
        this.statusCode = statusCode;
        this.stack = stack;
        this.data = null;
        this.message = message;
        this.error = error;
        this.success = false;

        if(stack){
            this.stack = stack;
        }
        else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { apiError };