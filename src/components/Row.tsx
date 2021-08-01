import { SWRow } from '../types/sw';
import Article from './Article';

interface RowProps {
	loaded: boolean;
	data?: SWRow;
}

export default function Row({ data, loaded }: RowProps): JSX.Element {
	if (!loaded) {
		return <div className="Row">{'Loading...'}</div>;
	}
	return (
		<div className="Row">
			{data?.map((art) => (
				<Article key={art.link} data={art} />
			))}
		</div>
	);
}
