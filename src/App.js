import React, { useEffect, useState } from 'react';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';
import twitterLogo from './assets/twitter-logo.svg';
import myEpicGame from './utils/contracts/MyEpicGame.json';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, TWITTER_HANDLE, TWITTER_LINK } from './constants';
import { transformCharacterData } from './utils/transformCharacterData';

const App = () => {
	const [currentAccount, setCurrentAccount] = useState(null);
	const [characterNFT, setCharacterNFT] = useState(null);
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
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};

	const connectWalletAction = async () => {
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

	useEffect(() => {
		setIsLoading(true);
		checkIfWalletIsConnected();
	}, []);

	useEffect(() => {
		const fetchNFT = async () => {
			const characterNFT = await gameContract.getCharacterNFT();
			if (characterNFT.name) {
				console.log('User has character NFT');
				setCharacterNFT(transformCharacterData(characterNFT));
			} else {
				console.log('No character NFT found!');
			}

			setIsLoading(false);
		};

		if (gameContract) {
			console.log(gameContract);
			fetchNFT();
		}
	}, [gameContract]);

	const renderContent = () => {
		if (isLoading) {
			return <LoadingIndicator />;
		}

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
		} else if (currentAccount && !characterNFT) {
			return (
				<SelectCharacter
					setCharacterNFT={setCharacterNFT}
					gameContract={gameContract}
				/>
			);
			/*
			 * If there is a connected wallet and characterNFT, it's time to battle!
			 */
		} else if (currentAccount && characterNFT) {
			return (
				<Arena
					characterNFT={characterNFT}
					setCharacterNFT={setCharacterNFT}
					gameContract={gameContract}
				/>
			);
		}
	};

	return (
		<div className="App">
			<div className="container">
				<div className="header-container">
					<p className="header gradient-text">
						⚔️ Teenage Mutant Ninja Turtles ⚔️
					</p>
					{renderContent()}
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
