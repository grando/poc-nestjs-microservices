import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

// Heleper function to format validation errors
function formatValidationErrors(errors: any): any[] {
    if (Array.isArray(errors)) {
        return errors.map(error => {
            const constraints = error.constraints ? Object.values(error.constraints).join(', ') : 'Validation failed';
            return {
                field: error.property,
                message: constraints,
            };
        });
    }
  
    if (typeof errors === 'string') {
        return [{ field: 'general', message: errors }];
    }
    return [{ field: 'unknown', message: errors.message || 'An unexpected error occurred.' }];
}

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(ValidationExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus(); // Ottiene lo status HTTP dall'eccezione

        const exceptionResponse = exception.getResponse(); // La risposta interna dell'eccezione

        let apiProblemDetails: any;

        // if is a validation error
        if (status === HttpStatus.BAD_REQUEST && exceptionResponse['message'] && Array.isArray(exceptionResponse['message'])) {
    
            this.logger.warn(`Validation failed for request to ${request.url}. Errors: ${JSON.stringify(exceptionResponse['message'])}`);
            apiProblemDetails = {
                type: 'validation-error',
                title: 'Your request parameters did not validate',
                status: status,
                detail: 'The provided payload failed one or more validation checks. See "errors" for details.',
                instance: request.url,
                errors: formatValidationErrors(exceptionResponse['message']), // use the helper to format errors field
            };
        } else {
            // otherwise, handle as a general HTTP error      
            const message = typeof exceptionResponse === 'string'
                            ? exceptionResponse
                            : (exceptionResponse['message'] || 'An error occurred.');

            this.logger.error(`HTTP Error (${status}) on ${request.url}: ${message}`);

            const errorType = exceptionResponse['type'] || ``;
            const errorTitle = exceptionResponse['error'] || exception.name.replace(/Exception$/, ' Error'); 
            const errorDetail = typeof exceptionResponse === 'string' ? exceptionResponse : message;

            apiProblemDetails = {
                type: errorType,
                title: errorTitle,
                status: status,
                detail: errorDetail,
                instance: request.url,
            };


        }

        response
            .status(status)
            .json(apiProblemDetails);
        }
    }
