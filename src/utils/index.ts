/* eslint-disable no-console */
import 'regenerator-runtime/runtime';
import { RowStatus } from '../types/scroll';
import { SWArticle, SWCategory } from '../types/sw';
import { SWCache } from './cache';
import { transform } from './extract';
import { fetchContent } from './fetcher';
import { getLogger } from './utils';

const logger = getLogger('loader');
const cache = SWCache.getInstance();

export async function loadPageData(
	pageNumber: number,
	category?: SWCategory
): Promise<SWArticle[]> {
	const cacheKey = `P${pageNumber}C${category}`;
	const cachedData = cache.get(cacheKey);

	if (cachedData?.length) {
		logger.info(`Using cached version for page ${pageNumber}`);
		return cachedData;
	}

	const html = await fetchContent(pageNumber, category);
	const data = transform(html);

	cache.set(cacheKey, data);

	return data;
}

interface LoaderInit {
	rows: SWArticle[];
	numberOfPages: number;
	category: SWCategory;
}

export class SWLoader {
	private loadedRows: SWArticle[];
	private static _instance: SWLoader;
	private category: SWCategory;
	private size: number;
	private readonly ITEMS_PER_ROW = 4;
	private readonly ITEMS_PER_PAGE = 24;

	private constructor() {
		this.loadedRows = [];
		this.size = 0;
		this.category = SWCategory.NONE;
	}

	setInitialData({ rows, numberOfPages, category }: LoaderInit): void {
		this.loadedRows = rows; // das hier ist falsch
		// rows ist hier die zahl der items, erst durch 4 teilen hier
		this.size = (numberOfPages * rows.length) / this.ITEMS_PER_ROW;
		this.category = category;
	}

	createRowsStatus(): RowStatus[] {
		return Array.from({ length: this.size }, () => RowStatus.UNLOADED);
	}

	getData(index: number): SWArticle | undefined {
		return this.loadedRows[index];
	}

	async loadMoreRows(start: number, stop: number): Promise<void> {
		logger.warn(`Loading rows ${start} to ${stop} inclusive`);

		//const cnt = stop - start + 1;

		//const itemsNeeded = cnt * this.ITEMS_PER_ROW;

		const startPage = Math.floor((start * this.ITEMS_PER_ROW) / this.ITEMS_PER_PAGE);
		const endPage = Math.floor((stop * this.ITEMS_PER_ROW) / this.ITEMS_PER_PAGE);

		logger.error(`Loading pages ${startPage} to ${endPage} inclusive`);

		const pagesNeeded = endPage - startPage + 1;

		const pageRequests = Array.from({ length: pagesNeeded }, (_, pageNum) =>
			loadPageData(pageNum, this.category)
		);

		const listOfPages = await Promise.all(pageRequests);
		const items_1 = listOfPages.flat();
		console.log(items_1);
	}

	static getInstance(): SWLoader {
		if (!SWLoader._instance) {
			SWLoader._instance = new SWLoader();
		}
		return SWLoader._instance;
	}
}
