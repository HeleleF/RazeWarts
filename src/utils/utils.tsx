import React from 'react';
import { render } from 'react-dom';
import { SWLoader } from '.';
import App from '../components/App';
import { SWCategory } from '../types/sw';
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
		console.log(
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
}

export const SWContext = React.createContext<SWContextProps>({
	jsonSchemaData: [],
	title: '',
	pageSize: 0,
});

export function rebuildPage(): void {
	const jsonSchemaData = Array.from(
		document.body.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'),
		getJSON
	);
	const initialArticles = extract(document);

	const num = document.querySelector('.jeg_pagination a:last-of-type')?.previousElementSibling;
	const np = (num as HTMLElement).dataset.id;

	SWLoader.getInstance().setInitialData({
		rows: initialArticles,
		numberOfPages: parseInt(np ?? '0', 10),
		category: SWCategory.NONE,
	});

	document.body = document.createElement('body');
	document.head.innerHTML = rebuildHeader();
	document.documentElement.removeAttribute('class');

	return render(
		<React.StrictMode>
			<SWContext.Provider
				value={{
					jsonSchemaData,
					title: 'SW Reloaded',
					pageSize: initialArticles.length,
				}}
			>
				<App />
			</SWContext.Provider>
		</React.StrictMode>,
		document.body
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
		getLogger('json').error(error.message);
		return {};
	}
}
