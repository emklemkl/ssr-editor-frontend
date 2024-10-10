import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Document } from "@interfaces/document";
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";
// Define an interface for the document structure

@Injectable({
	providedIn: "root"
})
export class SocketDocumentService {

	constructor(private socket: Socket) {}

	sendMessage(docUpdates: string) {
		this.socket.emit("doc-update", docUpdates);
	}
	// getMessage() {
	// 	return this.socket.fromEvent("message")
	// 	.pipe(map((data: { msg: any; }) => data.msg));
	// }
}
