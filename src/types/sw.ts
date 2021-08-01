import { getLogger } from '../utils/utils';

const logger = getLogger('sw types');

export enum SWCategory {
	NONE = '',
	ULTRA_HD = 'movies/2160p-uhd',
	FULL_HD = 'movies/1080p',
	HD_READY = 'movies/720p',
	SD = 'movies/sd-480p',
	UNTOUCHED = 'movies/untouched-bds',
	GAMES = 'games',
	TV_SERIES = 'tv-series',
	TOP = 'top-downloads',
}

export function getCategoryURIFragment(category: SWCategory): string {
	if (category === SWCategory.NONE) {
		return '';
	}

	return `category/${category}`;
}

export function getPageFrag(pageNumber: number): string {
	if (pageNumber < 1) {
		logger.warn(`${pageNumber} is not a valid page number and will be ignored`);
		return '';
	}

	if (pageNumber === 1) {
		return '';
	}

	return `/page/${pageNumber}`;
}

export interface SWArticle {
	title: string;
	link: string;
	thumbnail: string;
	excerpt: string;
	date: string;
}
