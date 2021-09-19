import { SWArticle } from '../types/sw';
import ArticleBody from './ArticleBody';
import ArticleHeader from './ArticleHeader';

interface RealRow {
	data: SWArticle | null;
	isPlaceholder: false;
}

interface PlaceholderRow {
	isPlaceholder: true;
}

type RowProps = RealRow | PlaceholderRow;

export default function Article(props: RowProps): JSX.Element {
	const isPlaceholder = props.isPlaceholder;

	if (isPlaceholder) {
		return (
			<div className="Article">
				<ArticleHeader isPlaceholder />
				<ArticleBody isPlaceholder />
			</div>
		);
	}
	const { data } = props;

	return (
		<div className="Article">
			{data !== null && (
				<>
					<ArticleHeader title={data.title} link={data.link} isPlaceholder={false} />
					<ArticleBody thumbnail={data.thumbnail} excerpt={data.excerpt} isPlaceholder={false} />
				</>
			)}
		</div>
	);
}
