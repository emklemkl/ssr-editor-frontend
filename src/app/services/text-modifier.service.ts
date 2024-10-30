import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
providedIn: 'root'
})
export class TextModifierService {

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
