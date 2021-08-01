import Header from './Header';
import Scroller from './Scroller';

export default function App(): JSX.Element {
	return (
		<div className="App">
			<Header />
			<div className="ScrollContainer">
				<Scroller />
			</div>
		</div>
	);
}
