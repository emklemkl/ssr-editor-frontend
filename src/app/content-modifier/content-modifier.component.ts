import { Component, EventEmitter, Output, Renderer2 } from "@angular/core";

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
	@Output() commentCreated = new EventEmitter<number>();
	constructor(private renderer: Renderer2) { }

	spanWrapper(type: "bold" | "comment" | "cursive" | "underscore") {
		let selection: Selection | null = window.getSelection();
		const COMMENT = "comment";
		if (selection && selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			let span = this.renderer.createElement("span");
			if (type == COMMENT) {
				const commentId = document.getElementsByClassName(COMMENT).length + 1;
				this.renderer.addClass(span, commentId.toString());
				this.commentCreated.emit(commentId);
			}
			this.renderer.addClass(span, type);
			span.innerHTML = range.toString();
			range.deleteContents();
			range.insertNode(span);


			// Set cursor to start outside the newly created <span>
			const space = this.renderer.createText("\u200B");
			span.parentNode!.insertBefore(space, span.nextSibling);
			const newRange = document.createRange();
			newRange.setStartAfter(space);
			newRange.collapse(true);
			selection.removeAllRanges();
			selection.addRange(newRange);
		}

	}
}


// import { Component, EventEmitter, Output, Renderer2 } from "@angular/core";

// @Component({
// 	selector: "app-content-modifier",
// 	standalone: true,
// 	imports: [],
// 	template: `
// 		<button type="button" (click)="spanWrapper('bold')" class="bold">B</button>
// 		<button type="button" (click)="spanWrapper('cursive')" class="cursive">k</button>
// 		<button type="button" (click)="spanWrapper('underscore')" class="underscore">U</button>
// 		<button type="button" (click)="spanWrapper('comment')">Comment</button>
// 	`,
// 	// templateUrl: "./content-modifier.component.html",
// 	styleUrl: "./content-modifier.component.scss"
// })
// export class ContentModifierComponent {
// 	@Output() commentCreated = new EventEmitter<number>();
// 	constructor(private renderer: Renderer2) {}
// 	spanWrapper(type: "bold" | "comment" | "cursive" | "underscore") {
// 		// let range: Range;
// 		let selection: Selection | null = window.getSelection();
// 		// let html: string;
// 		const COMMENT = "comment";
// 		if (selection && selection.rangeCount == 1) {
// 			// range = selection.getRangeAt(0);
// 			// if (range) {
// 				const range = selection.getRangeAt(0);
// 				let span = this.renderer.createElement("span");
// 				switch (type) {
// 					case COMMENT:
// 						// let allComments: any = document.getElementsByClassName(COMMENT);
// 						// html = `<span class="${type} ${allComments.length + 1}">` + range + "</span>";
// 						// this.commentCreated.emit(allComments.length + 1);
// 						let allComments = document.getElementsByClassName(COMMENT);
// 						span.className = `${COMMENT} ${allComments.length + 1}`;
// 						this.commentCreated.emit(allComments.length + 1);
// 						break;
// 					case "bold":
// 					case "underscore":
// 					case "cursive":
// 						span.className = type;
// 						// html = `<span class="${type}">` + range + "</span>";
// 						break;
// 				}
// 				// range.deleteContents();
// 				// let el = document.createElement("div");
// 				// el.innerHTML = html;
// 				// range.insertNode(el.children[0]);
// 				span.innerHTML = range.toString();
// 				range.deleteContents();
// 				range.insertNode(span);
// 			// }
// 		}
// 	}
// }
