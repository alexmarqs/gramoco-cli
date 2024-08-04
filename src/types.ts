export const ACTIONS = Object.freeze({
	EXTRACT_COMMENTS_MEDIA_EXCEL: "comments",
	EXTRACT_MEDIA_EXCEL: "media",
});

export type MediaCommentsResponse = {
	data: MediaComments[];
	paging?: Paging;
};

export type MediaShortcodeResponse = {
	id: string;
	shortcode: string;
};

export type Paging = {
	cursors?: Cursors;
	next?: string;
	previous?: string;
};

export type Cursors = {
	before?: string;
	after?: string;
};

export type MediaComments = {
	id: string;
	username: string;
	timestamp: string;
	text: string;
	like_count: number;
	parent_id?: string;
	replies?: {
		data: MediaComments[];
	};
};

export const MediaCommentsFields = Object.keys({} as MediaComments).join(",");

export type MediaPosts = {
	id: string;
	permalink: string;
	caption: string;
	timestamp: number;
	like_count: number;
	comments_count: number;
};

export type MediaPostsResponse = {
	data: MediaPosts[];
	paging?: Paging;
};
