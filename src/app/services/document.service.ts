import { HttpClient, HttpHeaders } from "@angular/common/http";
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

	constructor(
		private http: HttpClient
	 ) {}

	getAllDocuments(): Observable<Document[]> {
		const token = localStorage.getItem('jwtToken'); // Hämta token från localStorage
		const headers = new HttpHeaders({
		  'Authorization': `Bearer ${token}` // Skapa en Authorization-header
		});
	  
		return this.http.get<Document[]>(`${this.URL}/document/all`, { headers, withCredentials: true });
	  }
	getDocument(id: string | null): Observable<Document> {
		const token = localStorage.getItem('jwtToken'); // Hämta token från localStorage
    	const headers = new HttpHeaders({
      	'Authorization': `Bearer ${token}` // Skapa en Authorization-header
    });
		return this.http.get<Document>(`${this.URL}/document/${id}`, { headers, withCredentials: true });
	}
	submitCreateNewDoc(title: string, content: string): Observable<Document> {
		const token = localStorage.getItem('jwtToken'); // Hämta token från localStorage
		const headers = new HttpHeaders({
		  'Authorization': `Bearer ${token}` // Skapa en Authorization-header
		});
		const body = {
			title: title,
			content: content,
			// comments: { 1: "First comment", 2: "second comment" }
			comments: {}
		};
		return this.http.post<Document>(`${this.URL}/document/create`, body, { headers, withCredentials: true });
	}
	submitUpdateDoc(_id: string, title: string, content: string): Observable<Document> {
		const token = localStorage.getItem('jwtToken'); // Hämta token från localStorage
		const headers = new HttpHeaders({
		  'Authorization': `Bearer ${token}` // Skapa en Authorization-header
		});
		const body = {
			_id: _id,
			title: title,
			content: content
		};

		return this.http.put<Document>(`${this.URL}/document/update`, body, { headers, withCredentials: true });
	}

	getDocumentForEditing(
		id: string): Observable<Document> {
			const token = localStorage.getItem('jwtToken'); // Hämta token från localStorage
			const headers = new HttpHeaders({
		  'Authorization': `Bearer ${token}` // Skapa en Authorization-header
		});
		return this.http.get<Document>(`${this.URL}/document/${id}/edit`, { headers, withCredentials: true });
	}

}
