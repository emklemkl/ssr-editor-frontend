import { Component } from "@angular/core";

@Component({
	selector: "app-content-modifier",
	standalone: true,
	imports: [],
	template: `
		<button type="button" (click)="spanWrapper('bold')" class="bold">B</button>
		<button type="button" (click)="spanWrapper('cursive')" class="cursive">k</button>
		<button type="button" (click)="spanWrapper('underscore')" class="underscore">U</button>
		<button type="button" (click)="spanWrapper('comment')">Comment</button>
	`,
	// templateUrl: "./content-modifier.component.html",
	styleUrl: "./content-modifier.component.scss"
})
export class ContentModifierComponent {
	constructor() {}

	spanWrapper(type: "bold" | "comment" | "cursive" | "underscore") {
		let range: Range;
		let selection: Selection | null = window.getSelection();
		let html: string;
		const COMMENT = "comment";
		if (selection && selection.rangeCount == 1) {
			range = selection.getRangeAt(0);
			if (range) {
				switch (type) {
					case COMMENT:
						let allComments: any = document.getElementsByClassName(COMMENT);
						html = `<span class="${type} ${allComments.length + 1}">` + range + "</span>";
						break;
					case "bold":
					case "underscore":
					case "cursive":
						html = `<span class="${type}">` + range + "</span>";
						break;
					}
					range.deleteContents();
					let el = document.createElement("div");
					el.innerHTML = html;
					range.insertNode(el.children[0]);
			}
		}
	}
}
