import {
	MediaCommentsResponse,
	MediaPostsResponse,
	MediaShortcodeResponse,
} from "../../types";

export interface InstagramService {
	getCommentsFromMedia(
		accessToken: string,
		mediaId: string,
		cursorNext?: string,
	): Promise<MediaCommentsResponse>;
	getShortcodeFromMediaId(
		accessToken: string,
		mediaId: string,
	): Promise<MediaShortcodeResponse>;
	getPostsFromBusinessAccount(
		accessToken: string,
		businessAccountId: string,
		numberOfPosts: number | undefined,
		cursorNext?: string,
	): Promise<MediaPostsResponse>;
}
