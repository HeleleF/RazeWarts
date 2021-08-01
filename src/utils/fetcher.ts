import { getCategoryURIFragment, getPageFrag, SWCategory } from '../types/sw';
import { getLogger, urljoin } from './utils';

const logger = getLogger('fetch');

function buildRequest(pageNumber: number, category = SWCategory.NONE) {
	const categoryFrag = getCategoryURIFragment(category);
	const pageFrag = getPageFrag(pageNumber + 1);

	const input = `${urljoin(categoryFrag, pageFrag)}`;
	const info = {};

	return new Request(input, info);
}

export async function fetchContent(pageNumber: number, category?: SWCategory): Promise<string> {
	const pageRequest = buildRequest(pageNumber, category);

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
