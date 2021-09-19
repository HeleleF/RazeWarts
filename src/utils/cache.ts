import { SiteInfo, SWArticle } from '../types/sw';
import { getLogger } from './utils';

const logger = getLogger('cache');

export class SWCache {
	private static _instance: SWCache;
	private internal_cache: Record<string, SWArticle[]>;

	private constructor() {
		const c = sessionStorage.getItem('SW_CACHE');

		this.internal_cache = c ? JSON.parse(c) : {};

		logger.info('Cache setup');
	}

	getSiteInfo(): SiteInfo | null {
		const info = sessionStorage.getItem('SW_SITE_INFO');

		return info !== null ? JSON.parse(info) : null;
	}

	setSiteInfo(info: SiteInfo): void {
		sessionStorage.setItem('SW_SITE_INFO', JSON.stringify(info));
	}

	get(key: string): SWArticle[] | undefined {
		return this.internal_cache[key];
	}
	set(key: string, value: SWArticle[]): void {
		this.internal_cache[key] = value;
		sessionStorage.setItem('SW_CACHE', JSON.stringify(this.internal_cache));
	}

	static getInstance(): SWCache {
		if (!SWCache._instance) {
			SWCache._instance = new SWCache();
		}
		return SWCache._instance;
	}
}
