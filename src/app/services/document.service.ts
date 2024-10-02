import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Document } from "@interfaces/document";
// Define an interface for the document structure

@Injectable({
	providedIn: "root",
})
export class DocumentService {
	private URL = "http://localhost:5000/document";
	// private URL =
	// 	"https://js-emlo-f6byg8hvbvhahgfp.northeurope-01.azurewebsites.net/document";
	constructor(private http: HttpClient) {}
	getAllDocuments(): Observable<Document[]> {
		return this.http.get<Document[]>(`${this.URL}/all`);
	}
	getDocument(id: string | null): Observable<Document> {
		return this.http.get<Document>(`${this.URL}/${id}`);
	}
	submitCreateNewDoc(title: string, content: string): Observable<Document> {
		const body = {
			title: title,
			content: content,
		};
		return this.http.post<Document>(`${this.URL}/create`, body);
	}
	submitUpdateDoc(_id: string, title: string, content: string): Observable<Document> {
		const body = {
			_id: _id,
			title: title,
			content: content,
		};
		return this.http.put<Document>(`${this.URL}/update`, body);
	}
}
