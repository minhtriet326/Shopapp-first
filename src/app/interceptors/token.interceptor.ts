import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler} from '@angular/common/http';//dùng để gửi request
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private tokenService: TokenService) {}
    intercept(
        req: HttpRequest<any>, 
        next: HttpHandler): Observable<HttpEvent<any>> {
            debugger
            const token = this.tokenService.getToken();
            if(token) {
                //token khác null -> sửa header token và thêm Bearer đằng trước
                req = req.clone({//ko sửa trực tiếp request đc mà phải nhân bản(clone) ra, rồi sửa cái clone xong gán lại
                    setHeaders: {
                        Authorization: 'Bearer $(token)',
                    },
                });
            }
            return next.handle(req);//chèn Bearer vào xong cho đi tiếp
    }
    //đĂng ký interceptor trong module
}