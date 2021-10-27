const CONTRACT_ADDRESS = '0x6bc7eE87aE5b9b44F1d80D387a5aFB682ef08438';
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

/*
 * Add this method and make sure to export it on the bottom!
 */
const transformCharacterData = (characterData) => {
	return {
		name: characterData.name,
		imageURI: characterData.imageURI,
		hp: characterData.hp.toNumber(),
		maxHp: characterData.maxHp.toNumber(),
		attackDamage: characterData.attackDamage.toNumber(),
	};
};

export {
	CONTRACT_ADDRESS,
	transformCharacterData,
	TWITTER_LINK,
	TWITTER_HANDLE,
};
