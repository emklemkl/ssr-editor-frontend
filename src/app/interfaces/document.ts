export interface Document {
	_id: string;
	title: string;
	content?: string;
	comments?: any;
	// comments?: {[key:string] : string}
}
