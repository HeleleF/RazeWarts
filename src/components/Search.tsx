import { useState } from 'react';
import { SWLoader } from '../utils';

const loader = SWLoader.getInstance();

export default function Search(): JSX.Element {
	const [value, setValue] = useState('');

	// TODO: clear search and reset loader

	return (
		<div className="Search">
			<input
				className="Search-input"
				type="text"
				value={value}
				placeholder="Search for releases..."
				onChange={({ target }) => {
					setValue(target.value);
				}}
				onKeyPress={({ key }) => {
					if (key !== 'Enter') return;
					loader.setSearch(value);
				}}
			/>
		</div>
	);
}
