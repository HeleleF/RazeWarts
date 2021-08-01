import { useContext } from 'react';
import { img, SWContext } from '../utils/utils';

export default function Header(): JSX.Element {
	const ctx = useContext(SWContext);

	return (
		<div className="Header">
			<img src={img(ctx.logo, { height: 60 })} alt="Site Logo" />
			<span>{ctx.title}</span>
		</div>
	);
}
