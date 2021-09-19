import { getCategoryURIFragment, getPageFrag, getSearchQuery, SWCategory } from '../types/sw';
import { getLogger, urljoin } from './utils';

const logger = getLogger('fetch');

function buildRequest(pageNumber: number, category = SWCategory.NONE, search?: string) {
	const categoryFrag = getCategoryURIFragment(category);
	const pageFrag = getPageFrag(pageNumber + 1);

	const input = `${urljoin(categoryFrag, pageFrag)}${getSearchQuery(search)}`;
	const info = {};

	return new Request(input, info);
}

export async function fetchContent(
	pageNumber: number,
	category?: SWCategory,
	search?: string
): Promise<string> {
	const pageRequest = buildRequest(pageNumber, category, search);

	try {
		logger.info(`Requesting ${pageRequest.url}`);
		const response = await fetch(pageRequest);

		if (!response.ok) {
			throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
		}

		return await response.text();
	} catch (error) {
		logger.error(`Request failed with: ${error}`);
		return '';
	}
}
