import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Document } from "@interfaces/document";
// Define an interface for the document structure

@Injectable({
	providedIn: "root",
})
export class DocumentService {
	private URL =
		"https://js-emlo-f6byg8hvbvhahgfp.northeurope-01.azurewebsites.net/document";
	constructor(private http: HttpClient) {}
	getAllDocuments(): Observable<Document[]> {
		return this.http.get<Document[]>(`${this.URL}/all`);
	}
	getDocument(id: number): Observable<Document[]> {
		return this.http.get<Document[]>(`${this.URL}/${id}`);
	}
}
