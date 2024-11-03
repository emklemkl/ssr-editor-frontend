import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('jwtToken'); // Hämta token från localStorage
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}` // Lägg till Authorization header
            }
          });
        }
        return next.handle(request);
      }
    }
