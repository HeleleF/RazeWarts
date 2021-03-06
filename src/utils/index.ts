import { RowStatus } from '../types/scroll';
import { SWArticle, SWCategory, SWRow } from '../types/sw';
import { SWCache } from './cache';
import { transform } from './extract';
import { fetchContent } from './fetcher';
import { getLogger } from './utils';

const logger = getLogger('loader');
const cache = SWCache.getInstance();

export async function loadPageData(
	pageNumber: number,
	category?: SWCategory,
	search?: string
): Promise<SWArticle[]> {
	if (search !== undefined) {
		const html = await fetchContent(pageNumber, SWCategory.NONE, search);
		const data = transform(html);
		return data;
	}

	const cacheKey = `P${pageNumber}C${category}`;
	const cachedData = cache.get(cacheKey);

	if (cachedData?.length) {
		logger.info(`Using cached version for page ${pageNumber} with key ${cacheKey}`);
		return cachedData;
	}

	const html = await fetchContent(pageNumber, category);
	const data = transform(html);

	cache.set(cacheKey, data);

	return data;
}

interface LoaderInit {
	articles: SWArticle[];
	numberOfPages: number;
	category: SWCategory;
}

interface Func {
	(event: string): void;
}

export class SWLoader {
	private loadedArticles: SWArticle[];
	private static _instance: SWLoader;
	private category: SWCategory;
	private search?: string;
	private size: number;
	private readonly ITEMS_PER_ROW = 4;
	private readonly ITEMS_PER_PAGE = 24;
	private readonly ITEMS_PER_SEARCH_PAGE = 10;

	private observers: Func[] = [];

	private constructor() {
		this.loadedArticles = [];
		this.size = 0;
		this.category = SWCategory.NONE;
	}

	setInitialData({ articles, numberOfPages, category }: LoaderInit): void {
		this.loadedArticles = articles;
		this.size = (numberOfPages * articles.length) / this.ITEMS_PER_ROW;
		this.category = category;
	}

	createRowsStatus(): RowStatus[] {
		return Array.from({ length: this.size }, () => RowStatus.UNLOADED);
	}

	getData(rowIndex: number): SWRow | undefined {
		const from = rowIndex * this.ITEMS_PER_ROW;
		const row = this.loadedArticles.slice(from, from + this.ITEMS_PER_ROW);

		//return row.length === this.ITEMS_PER_ROW ? (row as SWRow) : undefined;
		// eslint-disable-next-line no-console

		if (row.length === 0) return undefined;

		if (row.length < this.ITEMS_PER_ROW) {
			return [...row, null, null, null].slice(0, this.ITEMS_PER_ROW) as SWRow;
		}

		return row as SWRow;
	}

	async loadMoreRows(start: number, stop: number): Promise<void> {
		logger.info(`Requesting rows ${start} to ${stop} inclusive`);

		const lastLoadedRow = this.loadedArticles.length / this.ITEMS_PER_ROW;
		logger.info(`last loaded row is ${lastLoadedRow}`);

		if (lastLoadedRow > start) {
			logger.info(` already have rows, starting at row ${lastLoadedRow}`);
			start = lastLoadedRow;
		}

		const cnt = stop - start + 1;

		const itemsNeeded = cnt * this.ITEMS_PER_ROW;

		logger.info(`we need ${cnt} new rows -> ${itemsNeeded} articles`);

		const itemsPerPage =
			this.search === undefined ? this.ITEMS_PER_PAGE : this.ITEMS_PER_SEARCH_PAGE;

		const startPage = Math.floor((start * this.ITEMS_PER_ROW) / itemsPerPage);
		const endPage = Math.floor((stop * this.ITEMS_PER_ROW) / itemsPerPage);

		logger.info(`Loading pages ${startPage} to ${endPage} inclusive`);

		const pagesNeeded = endPage - startPage + 1;

		const pageRequests = Array.from({ length: pagesNeeded }, (_, pageOffset) =>
			loadPageData(startPage + pageOffset, this.category, this.search)
		);

		const listOfPages = await Promise.all(pageRequests);
		const newArticles = listOfPages.flat();

		const recieved = newArticles.length;

		if (recieved === itemsNeeded) {
			this.loadedArticles.push(...newArticles);
			return;
		}

		if (recieved > itemsNeeded) {
			logger.info(`we recieved more rows than needed ${recieved}`);
			this.loadedArticles.push(...newArticles.slice(0, itemsNeeded));
		} else {
			logger.info(`we recieved fewer rows than needed ${recieved}`);
			this.loadedArticles.push(...newArticles);
		}
	}

	subscribe(callback: Func): () => void {
		this.observers.push(callback);

		return () => {
			this.observers = this.observers.filter((cb) => cb !== callback);
		};
	}

	async setSearch(searchValue: string): Promise<void> {
		this.search = searchValue.trim();

		const data = await loadPageData(0, SWCategory.NONE, this.search);

		// eslint-disable-next-line no-console
		console.log([...data]);

		this.setInitialData({
			articles: data,
			numberOfPages: 2,
			category: SWCategory.NONE,
		});

		for (const observer of this.observers) {
			observer('search changed' + this.search);
		}
	}

	static getInstance(): SWLoader {
		if (!SWLoader._instance) {
			SWLoader._instance = new SWLoader();
		}
		return SWLoader._instance;
	}
}
