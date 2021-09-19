import { SWRow } from '../types/sw';
import Article from './Article';

interface RowProps {
	loaded: boolean;
	data?: SWRow;
}

export default function Row({ data, loaded }: RowProps): JSX.Element {
	if (!loaded || data === undefined) {
		return (
			<div className="Row Row-Loading">
				<Article key={0} isPlaceholder />
				<Article key={1} isPlaceholder />
				<Article key={2} isPlaceholder />
				<Article key={3} isPlaceholder />
			</div>
		);
	}
	return (
		<div className="Row">
			{data.map((art, idx) => (
				<Article key={idx} data={art} isPlaceholder={false} />
			))}
		</div>
	);
}
