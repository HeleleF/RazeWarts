import { useContext } from 'react';
import { SWContext } from '../utils/utils';

export default function Header(): JSX.Element {
	const ctx = useContext(SWContext);

	return (
		<div className="Header">
			<span>{ctx.title}</span>
		</div>
	);
}
