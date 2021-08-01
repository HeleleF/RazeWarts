import { SWArticle } from '../types/sw';
import { getLogger } from './utils';

const logger = getLogger('cache');

export class SWCache {
	private static _instance: SWCache;
	private internal_cache: Record<string, SWArticle[]>;

	private constructor() {
		const c = localStorage.getItem('SW_CACHE');

		this.internal_cache = c ? JSON.parse(c) : {};

		logger.info('Cache setup');

		window.onbeforeunload = () => {
			localStorage.setItem('SW_CACHE', JSON.stringify(this.internal_cache));
			return '';
		};
	}

	get(key: string): SWArticle[] | undefined {
		return this.internal_cache[key];
	}
	set(key: string, value: SWArticle[]): void {
		this.internal_cache[key] = value;
	}

	static getInstance(): SWCache {
		if (!SWCache._instance) {
			SWCache._instance = new SWCache();
		}
		return SWCache._instance;
	}
}
