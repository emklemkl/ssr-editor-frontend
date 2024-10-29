import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";
// Define an interface for the document structure

@Injectable({
	providedIn: "root"
})
export class SocketDocumentService {

	constructor(private socket: Socket) {}

	async sendCreateComment(docUpdates: string) {
		await this.socket.emit("comment-create", docUpdates);
	}
	sendChangesComment(docUpdates: string) {
		this.socket.emit("comment-change", docUpdates);
	}
	sendDeleteComment(docUpdates: string) {
		this.socket.emit("comment-delete", docUpdates);
	}
	createRoom(_id: string) {
		this.socket.emit("create", _id);
	}
	sendChanges(docUpdates: string) {
		this.socket.emit("doc-update", docUpdates);
	}
	getChanges(): Observable<Document> {
		// .pipe(map((data: { msg: any; }) => data.msg));
		return this.socket.fromEvent<Document>("doc-update");
	}
}
