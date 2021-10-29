/*
 * Add this method and make sure to export it on the bottom!
 */
const transformCharacterData = (characterData) => {
	return {
		index: characterData.characterIndex?.toNumber(),
		name: characterData.name,
		imageURI: characterData.imageURI,
		attackImageURI: characterData.attackImageURI,
		loseImageURI: characterData.loseImageURI,
		eatImageURI: characterData.eatImageURI,
		hp: characterData.hp.toNumber(),
		maxHp: characterData.maxHp.toNumber(),
		attackDamage: characterData.attackDamage.toNumber(),
		healAmount: characterData.healAmount?.toNumber() || 0,
		criticalChance: characterData.criticalChance?.toNumber() || 0,
	};
};

export { transformCharacterData };
