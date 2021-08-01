import { SWArticle } from '../types/sw';
import { img } from '../utils/utils';

type ArticleBodyProps = Pick<SWArticle, 'excerpt' | 'thumbnail'>;

export default function ArticleBody({ thumbnail, excerpt }: ArticleBodyProps): JSX.Element {
	const src = img(thumbnail, { height: 400, width: 350 });

	return (
		<div className="flip-card">
			<div className="flip-card-inner">
				<div className="flip-card-front">
					<img className="Article-thumb" src={src} loading="lazy" height={400} width={350} />
				</div>
				<div className="flip-card-back">
					<span className="Article-excerpt">{excerpt}</span>
				</div>
			</div>
		</div>
	);
}
