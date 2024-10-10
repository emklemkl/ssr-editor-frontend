import { provideHttpClient, withFetch } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";
import { routes } from "./app.routes";
const config: SocketIoConfig = { url: "http://localhost:5000", options: {} };
// const config: SocketIoConfig = { url: "https://js-emlo-f6byg8hvbvhahgfp.northeurope-01.azurewebsites.net/document", options: {} };

SocketIoModule.forRoot(config);
export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes, withComponentInputBinding()),
		provideHttpClient(withFetch()),
		importProvidersFrom(SocketIoModule.forRoot(config))
	]
};
