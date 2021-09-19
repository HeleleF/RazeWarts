import { SWArticle } from '../types/sw';

interface PlaceholderHeader {
	isPlaceholder: true;
}
type ArticleHeader = Pick<SWArticle, 'title' | 'link'> & { isPlaceholder: false };

type ArticleHeaderProps = PlaceholderHeader | ArticleHeader;

export default function ArticleHeader(props: ArticleHeaderProps): JSX.Element {
	if (props.isPlaceholder) {
		return <div className="Article-title-loading fading"></div>;
	}

	const { link, title } = props;

	return (
		<a className="Article-title-link" href={link} target="_blank" rel="noopener noreferrer">
			<h1 className="Article-title">{title}</h1>
		</a>
	);
}
