import { SWArticle } from '../types/sw';
import { getLogger } from './utils';

const logger = getLogger('extract');
const dp = new DOMParser();

function parseHtml(data: string): Document | null {
	try {
		return dp.parseFromString(data, 'text/html');
	} catch (error) {
		logger.error(`Failed to parse html: ${error}`);
		return null;
	}
}

function extractArticle(article: HTMLElement): SWArticle {
	const title = article.querySelector('.jeg_post_title')?.textContent?.trim() ?? 'Title not found';
	const excerpt =
		article.querySelector('.jeg_post_excerpt')?.textContent?.trim() ?? 'Excerpt not found';
	const date = article.querySelector('.jeg_meta_date')?.textContent?.trim() ?? 'Date not found';
	const link = article.querySelector('a')?.href ?? 'Link not found';
	const thumbnail = article.querySelector('img')?.dataset.src ?? 'Thumb not found';

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
