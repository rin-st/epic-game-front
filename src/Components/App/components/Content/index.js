import React, { useCallback } from 'react';

import SelectCharacter from '../../../SelectCharacter';
import Arena from '../../../Arena';
import LoadingIndicator from '../../../LoadingIndicator';

const Content = ({
	isLoading,
	currentAccount,
	setCurrentAccount,
	gameContract,
	characterNFT,
	setCharacterNFT,
}) => {
	const connectWalletAction = useCallback(() => {
		const connectWallet = async () => {
			try {
				const { ethereum } = window;

				if (!ethereum) {
					alert('Get MetaMask!');
					return;
				}

				const accounts = await ethereum.request({
					method: 'eth_requestAccounts',
				});

				console.log('Connected', accounts[0]);
				setCurrentAccount(accounts[0]);
			} catch (error) {
				console.log(error);
			}
		};
		connectWallet();
	}, [setCurrentAccount]);

	if (!currentAccount) {
		return (
			<div className="connect-wallet-container">
				<img
					src="https://cloudflare-ipfs.com/ipfs/QmRgdKqhMPGBp4jbExCCXT89zGmvPAr5xtdd5vR8MyXkHx"
					alt="tmnt"
				/>
				<button
					className="cta-button connect-wallet-button"
					onClick={connectWalletAction}
				>
					Connect Wallet To Get Started
				</button>
			</div>
		);
	}

	if (isLoading || characterNFT === undefined) {
		return <LoadingIndicator />;
	}

	if (characterNFT === null) {
		return (
			<SelectCharacter
				setCharacterNFT={setCharacterNFT}
				gameContract={gameContract}
			/>
		);
	}

	return (
		<Arena
			characterNFT={characterNFT}
			setCharacterNFT={setCharacterNFT}
			gameContract={gameContract}
		/>
	);
};

export default Content;
