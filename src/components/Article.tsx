import { SWArticle } from '../types/sw';
import ArticleBody from './ArticleBody';
import ArticleHeader from './ArticleHeader';

interface RowProps {
	data: SWArticle;
}

export default function Article({ data }: RowProps): JSX.Element {
	return (
		<div className="Article">
			<ArticleHeader title={data.title} link={data.link} />
			<ArticleBody thumbnail={data.thumbnail} excerpt={data.excerpt} />
		</div>
	);
}
