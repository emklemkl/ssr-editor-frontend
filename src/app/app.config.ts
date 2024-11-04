import { provideHttpClient, withFetch } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";
import { routes } from "./app.routes";
import { environment } from "environments/environment.prod";

const config: SocketIoConfig = { url: environment.BASE_URL };
// const config: SocketIoConfig = { url: "https://js-emlo-f6byg8hvbvhahgfp.northeurope-01.azurewebsites.net/", options: {} };

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes, withComponentInputBinding()),
		provideHttpClient(withFetch()),
		importProvidersFrom(SocketIoModule.forRoot(config))
	]
};
