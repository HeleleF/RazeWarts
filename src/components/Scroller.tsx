import { useCallback, useEffect, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ItemProps, RowStatus } from '../types/scroll';
import Row from './Row';
import { SWLoader } from '../utils';
import { getLogger } from '../utils/utils';

const loader = SWLoader.getInstance();
const logger = getLogger('scroller');

const PADDING = 35;

export default function Scroller(): JSX.Element {
	const [rowsStatus, setRowsStatus] = useState(() => loader.createRowsStatus());
	const loaderRef = useRef<InfiniteLoader | null>(null);
	const listRef = useRef<List | null>(null);

	const isItemLoaded = (index: number) => rowsStatus[index] === RowStatus.LOADED;
	const loadMoreItems = useCallback(
		(startIndex: number, stopIndex: number) => {
			// eslint-disable-next-line no-console
			console.log(startIndex, stopIndex);

			const newRowsStatus = [...rowsStatus];
			for (let index = startIndex; index <= stopIndex; index++) {
				newRowsStatus[index] = RowStatus.LOADING;
			}
			setRowsStatus(newRowsStatus);

			return loader.loadMoreRows(startIndex, stopIndex).then(() => {
				const newRowsStatus = [...rowsStatus];
				for (let index = startIndex; index <= stopIndex; index++) {
					newRowsStatus[index] = RowStatus.LOADED;
					setRowsStatus(newRowsStatus);
				}
			});
		},
		[rowsStatus]
	);

	const RowRenderer = ({ style, index }: ItemProps) => {
		return (
			<div className="ListItem" style={style}>
				<Row data={loader.getData(index)} loaded={isItemLoaded(index)} />
			</div>
		);
	};

	useEffect(() => {
		logger.info('effect');
		return loader.subscribe((ev: string) => {
			logger.info(ev);
			listRef.current?.scrollToItem(0);
			loaderRef.current?.resetloadMoreItemsCache(true);
			setRowsStatus(loader.createRowsStatus());
			loadMoreItems(0, 4);
		});
	}, [loadMoreItems]);

	return (
		<AutoSizer>
			{({ width, height }) => (
				<InfiniteLoader
					isItemLoaded={isItemLoaded}
					itemCount={rowsStatus.length}
					loadMoreItems={loadMoreItems}
					ref={(ref) => {
						loaderRef.current = ref;
					}}
				>
					{({ onItemsRendered, ref }) => (
						<List
							className="List"
							height={height}
							itemCount={rowsStatus.length}
							itemSize={500 + PADDING}
							onItemsRendered={onItemsRendered}
							ref={(list) => {
								if (typeof ref === 'function') ref(list);
								listRef.current = list;
							}}
							width={width}
						>
							{RowRenderer}
						</List>
					)}
				</InfiniteLoader>
			)}
		</AutoSizer>
	);
}
