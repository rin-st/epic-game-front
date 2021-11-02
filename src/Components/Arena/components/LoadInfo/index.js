import LoadingIndicator from '../../../LoadingIndicator';

const LoadInfo = ({ attackState }) => {
	switch (attackState) {
		case 'attacking':
			return (
				<div className="loading-indicator">
					<LoadingIndicator />
					<p>Attacking ⚔️</p>
				</div>
			);
		case 'eating':
			return (
				<div className="loading-indicator">
					<LoadingIndicator />
					<p>🍕 Eating pizza</p>
				</div>
			);
		default:
			return <div className="loading-indicator" />;
	}
};

export default LoadInfo;
