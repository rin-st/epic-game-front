import React from 'react';

const Character = ({ characterNFT, attackState, isFighting }) => {
	const getCharacterURI = () => {
		if (attackState === 'eating') return characterNFT.eatImageURI;
		if (characterNFT.hp === 0) return characterNFT.loseImageURI;

		switch (attackState) {
			case 'attacking':
				return characterNFT.attackImageURI;
			default:
				return characterNFT.imageURI;
		}
	};

	return (
		<div className={`player-container${isFighting ? ' fighting' : ''}`}>
			<div className="player">
				<div className="image-content" key="image">
					<h2>{characterNFT.name}</h2>
					<div className="img-container">
						<img
							src={getCharacterURI()}
							alt={`Character ${characterNFT.name}`}
						/>
					</div>
					<div className="health-bar">
						<progress value={characterNFT.hp} max={characterNFT.maxHp} />
						<p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
					</div>
				</div>
				<div className="stats" key="stats">
					<h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
					<h4>{`⚡ Critical Chance: ${characterNFT.criticalChance}`}</h4>
					<h4>{`💜 Pizza heals ${characterNFT.healAmount} HP`}</h4>
				</div>
			</div>
		</div>
	);
};

export default Character;
