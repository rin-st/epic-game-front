import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import LoadingIndicator from '../LoadingIndicator';
import { transformCharacterData } from '../../utils/transformCharacterData';

const SelectCharacter = ({ setCharacterNFT, gameContract }) => {
	const [defaultCharacters, setDefaultCharacters] = useState([]);
	const [mintingCharacter, setMintingCharacter] = useState(false);

	useEffect(() => {
		const getDefaultCharacters = async () => {
			try {
				console.log('Getting contract defaultCharacters to mint');

				const defaultCharactersTxn = await gameContract.getAllDefaultChars();
				console.log('defaultCharactersTxn:', defaultCharactersTxn);

				const defaultCharacters = defaultCharactersTxn.map((characterData) =>
					transformCharacterData(characterData)
				);

				setDefaultCharacters(defaultCharacters);
			} catch (error) {
				console.error(
					'Something went wrong fetching defaultCharacters:',
					error
				);
			}
		};

		const onCharacterMint = async (sender, tokenId, defaultCharacterIndex) => {
			console.log(
				`CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${defaultCharacterIndex.toNumber()}`
			);

			if (gameContract) {
				const characterNFT = await gameContract.getCharacterNFT();
				if (characterNFT.name) {
					setCharacterNFT(transformCharacterData(characterNFT));
				}
			}
		};

		if (gameContract) {
			getDefaultCharacters();

			gameContract.on('CharacterNFTMinted', onCharacterMint);
		}

		return () => {
			if (gameContract) {
				gameContract.off('CharacterNFTMinted', onCharacterMint);
			}
		};
	}, [gameContract, setCharacterNFT]);

	const mintCharacterNFTAction = (characterId) => async () => {
		try {
			if (gameContract) {
				setMintingCharacter(true);
				console.log('Minting character in progress...');
				const mintTxn = await gameContract.mintCharacterNFT(characterId);
				await mintTxn.wait();
				console.log('mintTxn:', mintTxn);
			}
		} catch (error) {
			console.warn('MintCharacterAction Error:', error);
		} finally {
			setMintingCharacter(false);
		}
	};

	const renderDefaultCharacters = () =>
		defaultCharacters.map((character, index) => (
			<div className="character-item" key={character.name}>
				<div className="name-container">
					<p>{character.name}</p>
				</div>
				<div className="img-container">
					<img src={character.imageURI} alt={character.name} />
				</div>

				<div className="stats" key="stats">
					<h4>{`💜 Health: ${character.hp}`}</h4>
					<h4>{`⚔️ Attack Damage: ${character.attackDamage}`}</h4>
					<h4>{`⚡ Critical Chance: ${character.criticalChance}`}</h4>
					<h4>{`🍕 Heal Amount: ${character.healAmount}`}</h4>
				</div>
				{/* <Character characterNFT={character} attackState="" isFighting={false} /> */}
				<button
					type="button"
					className="character-mint-button"
					onClick={mintCharacterNFTAction(index)}
				>{`Mint ${character.name}`}</button>
			</div>
		));

	return (
		<div className="select-character-container">
			<h2>Mint Your Hero. Choose wisely.</h2>
			{defaultCharacters.length > 0 && (
				<div className="character-grid">{renderDefaultCharacters()}</div>
			)}
			{mintingCharacter && (
				<div className="loading">
					<div className="indicator">
						<LoadingIndicator />
						<p>Minting In Progress...</p>
					</div>
					<img
						src="https://cloudflare-ipfs.com/ipfs/QmXjFC6im8Biqu2gQ9W4RMPnwWCCgUmsqVqLTnNnoTCyM3"
						alt="Minting loading indicator"
					/>
				</div>
			)}
		</div>
	);
};

export default SelectCharacter;
