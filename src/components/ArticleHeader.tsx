import { SWArticle } from '../types/sw';

type ArticleBodyProps = Pick<SWArticle, 'title' | 'link'>;

export default function ArticleHeader({ title, link }: ArticleBodyProps): JSX.Element {
	return (
		<a className="Article-title-link" href={link} referrerPolicy={'no-referrer'}>
			<h1 className="Article-title">{title}</h1>
		</a>
	);
}
