import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

// Define an interface for the document structure
export interface Document {
	name: string;
}

@Injectable({
	providedIn: "root",
})
export class DocumentService {
	private URL = " http://localhost:5000/document";
	constructor(private http: HttpClient) {}
	getAllDocuments(): Observable<any> {
		return this.http.get(`${this.URL}/all`,)
	}
}
