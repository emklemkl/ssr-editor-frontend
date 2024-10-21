import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
	selector: "app-document-comments",
	standalone: true,
	imports: [],
	template: ``,
	styleUrl: "./document-comments.component.scss"
})
export class DocumentCommentsComponent implements OnInit {
	@Input() id = "";
	@Input() document$!: Observable<Document>;
	constructor() {}

	ngOnInit(): void {
		
	}
}
