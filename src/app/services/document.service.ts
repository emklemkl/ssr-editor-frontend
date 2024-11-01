import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Document } from "@interfaces/document";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
// Define an interface for the document structure

@Injectable({
	providedIn: "root"
})
export class DocumentService {
	private URL = environment.BASE_URL;
	// private URL = "https://js-emlo-f6byg8hvbvhahgfp.northeurope-01.azurewebsites.net/document";

	constructor(private http: HttpClient) {}
	getAllDocuments(): Observable<Document[]> {
		return this.http.get<Document[]>(`${this.URL}/document/all`, { withCredentials: true });
	}
	getDocument(id: string | null): Observable<Document> {
		return this.http.get<Document>(`${this.URL}/document/${id}`, { withCredentials: true });
	}
	submitCreateNewDoc(title: string, content: string): Observable<Document> {
		const body = {
			title: title,
			content: content,
			// comments: { 1: "First comment", 2: "second comment" }
			comments: {}
		};
		return this.http.post<Document>(`${this.URL}/document/create`, body, { withCredentials: true });
	}
	submitUpdateDoc(_id: string, title: string, content: string): Observable<Document> {
		const body = {
			_id: _id,
			title: title,
			content: content
		};

		return this.http.put<Document>(`${this.URL}/document/update`, body);
	}

	getDocumentForEditing(
		id: string): Observable<Document> {
		return this.http.get<Document>(`${this.URL}/document/${id}/edit`, { withCredentials: true });
	}

}
