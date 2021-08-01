import { SWArticle } from '../types/sw';

interface RowProps {
	loaded: boolean;
	data?: SWArticle;
}

export default function Row({ data, loaded }: RowProps): JSX.Element {
	return <div className="Row">{loaded ? `Row ${data?.title}` : 'Loading...'}</div>;
}
