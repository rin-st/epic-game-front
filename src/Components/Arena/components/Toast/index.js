import React from 'react';

import './Toast.css';

const Toast = ({ boss, toast, characterNFT }) => {
	return (
		boss && (
			<div id="toast" className={toast ? 'show' : ''}>
				<div id="desc">{`💥 ${toast === 'critical' ? 'Critical! ' : ''}${
					boss.name
				} was hit for ${
					characterNFT.attackDamage * (toast === 'critical' ? 2 : 1)
				}!`}</div>
			</div>
		)
	);
};

export default Toast;
