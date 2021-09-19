import { useContext } from 'react';
import { SWContext } from '../utils/utils';

export default function SingleRelease(): JSX.Element {
	const ctx = useContext(SWContext);

	// eslint-disable-next-line no-console
	console.log(ctx);

	return (
		<div className="SingleRelease">
			<p>Test</p>
		</div>
	);
}
