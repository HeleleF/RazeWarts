import Header from './Header';
import Scroller from './Scroller';
import SingleRelease from './SingleRelease';

interface AppProps {
	isSingleRelease: boolean;
}

export default function App({ isSingleRelease }: AppProps): JSX.Element {
	return (
		<div className="App">
			<Header />
			{isSingleRelease ? (
				<div className="SingleReleaseContainer">
					<SingleRelease />
				</div>
			) : (
				<div className="ScrollContainer">
					<Scroller />
				</div>
			)}
		</div>
	);
}
