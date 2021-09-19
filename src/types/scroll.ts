import { CSSProperties } from 'react';

export enum RowStatus {
	UNLOADED,
	LOADING,
	LOADED,
}

export interface ItemProps {
	style: CSSProperties;
	index: number;
	isScrolling?: boolean;
}
