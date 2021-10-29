import React from 'react';
import './LoadingIndicator.css';

const LoadingIndicator = () => {
	return (
		<div className="lds-ring">
			{Array(4)
				.fill()
				.map((_, i) => (
					<div key={i}></div>
				))}
		</div>
	);
};

export default LoadingIndicator;
