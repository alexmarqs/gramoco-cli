import { ofetch } from "ofetch";
import {
	MediaCommentsResponse,
	MediaPostsResponse,
	MediaShortcodeResponse,
} from "../../types";
import { InstagramService } from "./instagram-service";

const PAGE_SIZE = process.env.GRAMOCO_API_PAGE_SIZE
	? parseInt(process.env.GRAMOCO_API_PAGE_SIZE)
	: 50;
const BASE_API_URL = "https://graph.facebook.com/v18.0";
const apiFetch = ofetch.create({ baseURL: BASE_API_URL });

const getCommentsFromMedia = async (
	accessToken: string,
	mediaId: string,
	cursorNext?: string,
) => {
	const response = await apiFetch<MediaCommentsResponse>(
		`/${mediaId}/comments`,
		{
			method: "GET",
			query: {
				access_token: accessToken,
				fields:
					"id,username,timestamp,text,like_count,replies{parent_id,id,username,timestamp,text,like_count}",
				after: cursorNext || undefined,
				limit: PAGE_SIZE,
			},
		},
	);

	return response;
};

const getShortcodeFromMediaId = async (
	accessToken: string,
	mediaId: string,
) => {
	const response = await apiFetch<MediaShortcodeResponse>(`/${mediaId}`, {
		method: "GET",
		query: {
			access_token: accessToken,
			fields: "id,shortcode",
		},
	});

	return response;
};

const getPostsFromBusinessAccount = async (
	accessToken: string,
	businessAccountId: string,
	numberOfPosts: number | undefined,
	cursorNext?: string,
) => {
	const response = await apiFetch<MediaPostsResponse>(
		`/${businessAccountId}/media`,
		{
			method: "GET",
			query: {
				access_token: accessToken,
				fields: "id,permalink,caption,timestamp,like_count,comments_count",
				after: cursorNext || undefined,
				// check if numberOfPosts is greater than PAGE_SIZE, if so, set limit to PAGE_SIZE
				limit: numberOfPosts
					? numberOfPosts > PAGE_SIZE
						? PAGE_SIZE
						: numberOfPosts
					: PAGE_SIZE,
			},
		},
	);

	return response;
};

export const instagramService: InstagramService = {
	getCommentsFromMedia,
	getShortcodeFromMediaId,
	getPostsFromBusinessAccount,
};
