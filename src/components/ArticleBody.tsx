import { ChangeEvent } from 'react';
import { SWArticle } from '../types/sw';
import { img } from '../utils/utils';

import fallbackImage from '../assets/404.png';

interface PlaceholderBody {
	isPlaceholder: true;
}

type ArticleBody = Pick<SWArticle, 'excerpt' | 'thumbnail'> & { isPlaceholder: false };

type ArticleBodyProps = PlaceholderBody | ArticleBody;

export default function ArticleBody(props: ArticleBodyProps): JSX.Element {
	if (props.isPlaceholder) {
		return <div className="Article-thumb-loading fading"></div>;
	}

	const { thumbnail, excerpt } = props;
	const src = img(thumbnail, { height: 400, width: 350 });

	return (
		<div className="flip-card">
			<div className="flip-card-inner">
				<div className="flip-card-front">
					<img
						className="Article-thumb"
						src={src}
						loading="lazy"
						height={400}
						width={350}
						onError={(ev: ChangeEvent<HTMLImageElement>) => (ev.target.src = fallbackImage)}
					/>
				</div>
				<div className="flip-card-back">
					<span className="Article-excerpt">{excerpt}</span>
				</div>
			</div>
		</div>
	);
}
