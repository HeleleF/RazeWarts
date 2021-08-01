import { useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ItemProps, RowStatus } from '../types/scroll';
import Row from './Row';
import { SWLoader } from '../utils';

const loader = SWLoader.getInstance();

export default function Scroller(): JSX.Element {
	const [rowsStatus, setRowsStatus] = useState(() => loader.createRowsStatus());

	const isItemLoaded = (index: number) => rowsStatus[index] === RowStatus.LOADED;
	const loadMoreItems = (startIndex: number, stopIndex: number) => {
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
	};

	const RowRenderer = ({ style, index }: ItemProps) => {
		return (
			<div className="ListItem" style={style}>
				<Row data={loader.getData(index)} loaded={isItemLoaded(index)} />
			</div>
		);
	};

	return (
		<AutoSizer>
			{({ width, height }) => (
				<InfiniteLoader
					isItemLoaded={isItemLoaded}
					itemCount={rowsStatus.length}
					loadMoreItems={loadMoreItems}
				>
					{({ onItemsRendered, ref }) => (
						<List
							className="List"
							height={height}
							itemCount={rowsStatus.length}
							itemSize={300}
							onItemsRendered={onItemsRendered}
							ref={ref}
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
