import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";
// Define an interface for the document structure

@Injectable({
	providedIn: "root"
})
export class SocketDocumentService {

	constructor(private socket: Socket) {}

	sendChanges(docUpdates: string) {
		this.socket.emit("doc-update", docUpdates);
	}
	createRoom(_id: string) {
		this.socket.emit("create", _id);
	}
	getChanges(): Observable<Document> {
		// .pipe(map((data: { msg: any; }) => data.msg));
		return this.socket.fromEvent<Document>("doc-update");
	}
}
