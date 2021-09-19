import { createContext, StrictMode } from 'react';
import { render } from 'react-dom';
import { SWLoader } from '.';
import App from '../components/App';
import { SWCategory } from '../types/sw';
import { SWCache } from './cache';
import { extract } from './extract';

// https://stackoverflow.com/a/49966753
export function urljoin(baseURL: string, relativeURL?: string): string {
	return relativeURL
		? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
		: baseURL;
}

interface Logger {
	info(value: string): void;
	warn(value: string): void;
	error(value: string): void;
}

export function getLogger(name: string): Logger {
	const _log = (value: string, style: string) => {
		// eslint-disable-next-line no-console
		console.info(
			`%c${new Date().toLocaleTimeString('de-DE')} - ${name} - ${value}`,
			`font-family: Titillium Web; ${style}`
		);
	};

	return {
		info(value: string) {
			_log(value, 'color: #f8ffdb');
		},
		warn(value: string) {
			_log(value, 'color: #ffc625');
		},
		error(value: string) {
			_log(value, 'color: #E91E63; font-weight: bold');
		},
	};
}

export function rebuildHeader(): string {
	return `<meta charset="utf-8"><title>SW Reloaded</title>`;
}

export interface SWContextProps {
	jsonSchemaData: Record<string, unknown>[];
	title: string;
	pageSize: number;
	logo: string;
}

export const SWContext = createContext<SWContextProps>({
	jsonSchemaData: [],
	title: '',
	pageSize: 0,
	logo: '',
});

interface ImgOpts {
	height: number;
	width: number;
	fit: string;
}

function createQuery({ width, height, fit }: Partial<ImgOpts>) {
	let query = '';

	query += width ? `&w=${width}` : '';
	query += height ? `&h=${height}` : '';
	query += `&fit=${fit ? fit : 'cover'}`;

	return query;
}

export function img(url: string, config?: Partial<ImgOpts>): string {
	// why fastpic...
	const imgUrl = url.replace('fastpic.ru', 'fastpic.org');
	const extras = config ? createQuery(config) : '';

	return `https://images.weserv.nl/?url=${imgUrl}${extras}`;
}

export function rebuildPage(): void {
	const jsonSchemaData = Array.from(
		document.body.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'),
		getJSON
	);
	const initialArticles = extract(document);

	const logo = document.body.querySelector<HTMLImageElement>('.jeg_logo_img')?.src ?? '';

	const num = document.querySelector('.jeg_pagination a:last-of-type')?.previousElementSibling;
	const np = (num as HTMLElement)?.dataset.id;

	const isSingleRelease = jsonSchemaData.length === 2;

	SWLoader.getInstance().setInitialData({
		articles: initialArticles,
		numberOfPages: parseInt(np ?? '0', 10),
		category: SWCategory.NONE,
	});
	SWCache.getInstance().set('P0C', initialArticles);

	document.body = document.createElement('body');
	document.head.innerHTML = rebuildHeader();
	document.documentElement.removeAttribute('class');

	const root = document.createElement('div');
	document.body.appendChild(root);

	return render(
		<StrictMode>
			<SWContext.Provider
				value={{
					jsonSchemaData,
					title: 'SW Reloaded',
					pageSize: initialArticles.length,
					logo,
				}}
			>
				<App isSingleRelease={isSingleRelease} />
			</SWContext.Provider>
		</StrictMode>,
		root
	);
}

export function getJSON(script: HTMLScriptElement): Record<string, unknown> {
	const str = script.textContent?.trim();
	if (!str) {
		return {};
	}

	try {
		return JSON.parse(str);
	} catch (error) {
		getLogger('json').error((error as Error).message);
		return {};
	}
}
