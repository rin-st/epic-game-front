import React, { useCallback, useEffect, useState } from 'react';
import { transformCharacterData } from '../../utils/transformCharacterData';
import LoadingIndicator from '../LoadingIndicator';
import './Arena.css';
import Character from '../Character';

const Arena = ({ characterNFT, setCharacterNFT, gameContract }) => {
	const [boss, setBoss] = useState(null);
	const [attackState, setAttackState] = useState('');
	const [toast, setToast] = useState(null);
	const [activeCharacters, setActiveCharacters] = useState([]);

	const runAttackAction = async () => {
		try {
			if (gameContract) {
				setAttackState('attacking');
				console.log('Attacking boss...');
				const attackTxn = await gameContract.attackBoss({
					gasLimit: 300000,
				});
				await attackTxn.wait();
				console.log('attackTxn:', attackTxn);
			}
		} catch (error) {
			console.error('Error attacking boss:', error);
			setAttackState('');
		}
	};

	const eatPizzaAction = async () => {
		try {
			if (gameContract) {
				setAttackState('eating');
				console.log('Eating pizza...');
				const attackTxn = await gameContract.heal({
					gasLimit: 300000,
				});
				await attackTxn.wait();
				console.log('attackTxn:', attackTxn);
				setAttackState('');
			}
		} catch (error) {
			console.error('Error attacking boss:', error);
			setAttackState('');
		}
	};

	const getActiveCharacters = useCallback(() => {
		const asyncGetChars = async () => {
			try {
				const characters = await gameContract.getAllCharacters({
					gasLimit: 300000,
				});
				setActiveCharacters(
					characters
						.map(transformCharacterData)
						.filter((character) => character.index !== characterNFT.index)
				);
			} catch (error) {
				console.error('Something went wrong fetching characters:', error);
			}
		};
		asyncGetChars();
	}, [characterNFT.index, gameContract]);

	useEffect(() => {
		const fetchBoss = async () => {
			const bossTxn = await gameContract.getBigBoss({
				gasLimit: 300000,
			});
			setBoss(transformCharacterData(bossTxn));
		};

		if (gameContract) {
			fetchBoss();
			getActiveCharacters();
		}
	}, [gameContract, getActiveCharacters]);

	useEffect(() => {
		const fetchBoss = async () => {
			const bossTxn = await gameContract.getBigBoss({
				gasLimit: 300000,
			});
			setBoss(transformCharacterData(bossTxn));
		};

		const onAttackComplete = async (
			newBossHp,
			newPlayerHp,
			characterIndex,
			isCritical
		) => {
			const bossHp = newBossHp.toNumber();
			const playerHp = newPlayerHp.toNumber();
			let isHeal = boss?.hp === bossHp;

			console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

			setBoss((prevState) => {
				return { ...prevState, hp: bossHp };
			});

			if (characterIndex.toNumber() === characterNFT.index) {
				setCharacterNFT((prevState) => {
					return { ...prevState, hp: playerHp };
				});
				if (!isHeal) {
					setAttackState('hit');
					setToast(isCritical ? 'critical' : 'normal');
					setTimeout(() => {
						setToast(null);
						setAttackState('');
					}, 5000);
				}
			} else {
				getActiveCharacters();
			}
		};

		if (gameContract) {
			fetchBoss();
			gameContract.on('AttackComplete', onAttackComplete);
		}

		return () => {
			if (gameContract) {
				gameContract.off('AttackComplete', onAttackComplete);
			}
		};
	}, [
		boss?.hp,
		characterNFT.index,
		gameContract,
		getActiveCharacters,
		setCharacterNFT,
	]);

	const getBigBossURI = () => {
		if (boss.hp === 0) return boss.loseImageURI;

		switch (attackState) {
			case 'attacking':
				return boss.attackImageURI;
			case 'eating':
				return boss.eatImageURI;
			default:
				return boss.imageURI;
		}
	};

	return (
		<div className="arena-container">
			{boss && (
				<div id="toast" className={toast ? 'show' : ''}>
					<div id="desc">{`💥 ${toast === 'critical' ? 'Critical! ' : ''}${
						boss.name
					} was hit for ${
						characterNFT.attackDamage * (toast === 'critical' ? 2 : 1)
					}!`}</div>
				</div>
			)}

			<div className="vs-arena">
				{/* Character NFT */}
				{characterNFT && (
					<div className="players-container">
						{/* <h2>Your Character</h2> */}
						<Character
							characterNFT={characterNFT}
							attackState={attackState}
							isFighting
						/>
						<div className="attack-container">
							<button
								className="cta-button"
								onClick={eatPizzaAction}
								disabled={characterNFT.hp === characterNFT.maxHp}
							>
								{`🍕 Eat pizza!`}
							</button>
							<h4>{`⚔️ Heals ${characterNFT.healAmount} HP`}</h4>
						</div>
					</div>
				)}
				{attackState === 'attacking' && (
					<div className="loading-indicator">
						<LoadingIndicator />
						<p>Attacking ⚔️</p>
					</div>
				)}
				{attackState === 'eating' && (
					<div className="loading-indicator">
						<LoadingIndicator />
						<p>🍕 Eating pizza</p>
					</div>
				)}
				{/* Boss */}
				{boss && (
					<div className="boss-container">
						<div className={`boss-content  ${attackState}`}>
							<h2>🔥 {boss.name} 🔥</h2>
							<div className="image-content">
								<div className="img-container">
									<img src={getBigBossURI()} alt={`Boss ${boss.name}`} />
								</div>
								<div className="health-bar">
									<progress value={boss.hp} max={boss.maxHp} />
									<p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
								</div>
							</div>
							<div className="stats" key="stats">
								<h4>{`⚔️ Attack Damage: ${boss.attackDamage}`}</h4>
								<h4>{`⚡ Critical Chance: ${boss.criticalChance}`}</h4>
							</div>
						</div>
						<div className="attack-container">
							<button
								className="cta-button"
								onClick={runAttackAction}
								disabled={boss.hp === 0 || characterNFT.hp === 0}
							>
								{`💥 Attack ${boss.name}`}
							</button>
						</div>
					</div>
				)}
			</div>
			{activeCharacters.length > 0 && (
				<div className="active-players">
					<h2>Active Players</h2>
					<div className="players-list">
						{activeCharacters.map((activeCharacter) => (
							<Character
								characterNFT={activeCharacter}
								key={activeCharacter.index}
								attackState=""
								isFighting={false}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default Arena;
