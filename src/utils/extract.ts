import { SWArticle } from '../types/sw';
import { getLogger } from './utils';

import fallbackImage from '../assets/404.png';

const logger = getLogger('extract');
const dp = new DOMParser();

const EXCERPT_START_MARKER = 'Description:';
const EXCERPT_END_MARKER = 'NFO:';

function parseHtml(data: string): Document | null {
	try {
		return dp.parseFromString(data, 'text/html');
	} catch (error) {
		logger.error(`Failed to parse html: ${error}`);
		return null;
	}
}

function getExcerpt(article: HTMLElement): string {
	const text = article.querySelector('.jeg_post_excerpt')?.textContent?.trim();

	if (!text) {
		return 'Excerpt not found';
	}
	const startIndex = text.indexOf(EXCERPT_START_MARKER);
	const endIndex = text.indexOf(EXCERPT_END_MARKER);

	if (startIndex === -1) {
		return text;
	}

	return text.slice(
		startIndex + EXCERPT_START_MARKER.length,
		endIndex === -1 ? undefined : endIndex
	);
}

function extractArticle(article: HTMLElement): SWArticle {
	const title = article.querySelector('.jeg_post_title')?.textContent?.trim() ?? 'Title not found';
	const excerpt = getExcerpt(article);
	const date = article.querySelector('.jeg_meta_date')?.textContent?.trim() ?? 'Date not found';
	const link = article.querySelector('a')?.href ?? 'Link not found';
	const thumbnail = article.querySelector('img')?.dataset.src ?? fallbackImage;

	return {
		title,
		thumbnail,
		link,
		date,
		excerpt,
	};
}

export function extract(root: Document): SWArticle[] {
	return Array.from(root.querySelectorAll('article'), extractArticle);
}

export function transform(pageContent: string): SWArticle[] {
	const document = parseHtml(pageContent);
	if (!document) {
		return [];
	}
	const data = extract(document);

	return data;
}
