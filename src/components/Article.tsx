import { SWArticle } from '../types/sw';
import { img } from '../utils/utils';

interface RowProps {
	data: SWArticle;
}

export default function Article({ data }: RowProps): JSX.Element {
	return (
		<div className="Article">
			<h1 className="Article-title">{data.title}</h1>
			<div className="flip-card">
				<div className="flip-card-inner">
					<div className="flip-card-front">
						<img className="Article-thumb" src={img(data.thumbnail, { height: 400, width: 350 })} />
					</div>
					<div className="flip-card-back">
						<span className="Article-excerpt">{data.excerpt}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
