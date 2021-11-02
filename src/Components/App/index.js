import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import Content from './components/Content';
import twitterLogo from '../../assets/twitter-logo.svg';
import myEpicGame from '../../utils/contracts/MyEpicGame.json';
import { transformCharacterData } from '../../utils/transformCharacterData';
import { CONTRACT_ADDRESS, TWITTER_HANDLE, TWITTER_LINK } from './constants';

import './App.css';

const App = () => {
	const [currentAccount, setCurrentAccount] = useState(null);
	const [characterNFT, setCharacterNFT] = useState(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [gameContract, setGameContract] = useState(null);

	useEffect(() => {
		if (currentAccount) {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const gameContract = new ethers.Contract(
					CONTRACT_ADDRESS,
					myEpicGame.abi,
					signer
				);

				setGameContract(gameContract);
			} else {
				console.log('Ethereum object not found');
			}
		}
	}, [currentAccount]);

	const checkIfWalletIsConnected = async () => {
		try {
			setIsLoading(true);
			const { ethereum } = window;

			if (!ethereum) {
				console.log('Make sure you have MetaMask!');
				return;
			} else {
				console.log('We have the ethereum object', ethereum);
			}

			const accounts = await ethereum.request({ method: 'eth_accounts' });

			if (accounts.length !== 0) {
				const account = accounts[0];
				console.log('Found an authorized account:', account);
				setCurrentAccount(account);
			} else {
				console.log('No authorized account found');
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);

	useEffect(() => {
		const fetchNFT = async () => {
			setIsLoading(true);
			const characterNFT = await gameContract.getCharacterNFT();
			if (characterNFT.name) {
				console.log('User has character NFT');
				setCharacterNFT(transformCharacterData(characterNFT));
			} else {
				console.log('No character NFT found!');
				setCharacterNFT(null);
			}

			setIsLoading(false);
		};

		if (gameContract) {
			console.log(gameContract);
			fetchNFT();
		}
	}, [gameContract]);

	return (
		<div className="App">
			<div className="container">
				<div className="header-container">
					<p className="header gradient-text">
						⚔️ Teenage Mutant Ninja Turtles ⚔️
					</p>
					<Content
						isLoading={isLoading}
						currentAccount={currentAccount}
						setCurrentAccount={setCurrentAccount}
						gameContract={gameContract}
						characterNFT={characterNFT}
						setCharacterNFT={setCharacterNFT}
					/>
				</div>
				<div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`built with @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
};

export default App;
