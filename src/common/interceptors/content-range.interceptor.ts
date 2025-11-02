import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor
} from '@nestjs/common'
import { Response } from 'express'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class ContentRangeInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const res = context.switchToHttp().getResponse<Response>()

		return next.handle().pipe(
			map(data => {
				if (
					data &&
					Array.isArray(data.items) &&
					typeof data.count === 'number'
				) {
					res.setHeader(
						'Content-Range',
						`items 0-${data.items.length - 1}/${data.count}`
					)
					res.setHeader(
						'Access-Control-Expose-Headers',
						'Content-Range'
					)
					return data.items // react-admin ждёт чистый массив
				}
				return data
			})
		)
	}
}
