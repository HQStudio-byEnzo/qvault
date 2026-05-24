/**
 * Composable pour générer une seed phrase de démonstration
 * Utilise une liste de 256 mots simples en anglais et crypto.getRandomValues()
 */
export function useSeedGenerator() {
  // Liste de 256 mots simples pour la démo (pas BIP39 complet)
  const wordList = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
    'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
    'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actual', 'adapt',
    'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance', 'advice',
    'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent', 'agree',
    'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol',
    'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha',
    'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among', 'amount',
    'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry', 'animal',
    'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique', 'anxiety',
    'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch',
    'arctic', 'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army',
    'around', 'arrange', 'arrest', 'arrive', 'arrow', 'art', 'artefact', 'artist',
    'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume', 'asthma',
    'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction', 'audit',
    'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado', 'avoid',
    'awake', 'aware', 'awesome', 'awful', 'awkward', 'axis', 'baby', 'bachelor',
    'bacon', 'badge', 'bag', 'balance', 'balcony', 'ball', 'bamboo', 'banana',
    'banner', 'bar', 'barely', 'bargain', 'barrel', 'base', 'basic', 'basket',
    'battle', 'beach', 'bean', 'beauty', 'because', 'become', 'beef', 'before',
    'begin', 'behave', 'behind', 'believe', 'below', 'belt', 'bench', 'benefit',
    'best', 'betray', 'better', 'between', 'beyond', 'bicycle', 'bid', 'bike',
    'bind', 'biology', 'bird', 'birth', 'bitter', 'black', 'blade', 'blame',
    'blanket', 'blast', 'bleak', 'bless', 'blind', 'blood', 'blossom', 'blow',
    'blue', 'blur', 'blush', 'board', 'boat', 'body', 'boil', 'bomb',
    'bone', 'bonus', 'book', 'boost', 'border', 'boring', 'borrow', 'boss',
    'bottom', 'bounce', 'box', 'boy', 'bracket', 'brain', 'brand', 'brave',
    'bread', 'breeze', 'brick', 'bridge', 'brief', 'bright', 'bring', 'brisk',
    'broken', 'bronze', 'broom', 'brother', 'brown', 'brush', 'bubble', 'buddy',
    'budget', 'buffalo', 'build', 'bulb', 'bulk', 'bullet', 'bundle', 'bunny',
    'burden', 'burger', 'burst', 'bus', 'business', 'busy', 'butter', 'buyer',
    'buzz', 'cabbage', 'cabin', 'cable', 'cactus', 'cage', 'cake', 'call',
  ]

  /**
   * Génère une seed phrase de 12 mots aléatoires
   * Utilise crypto.getRandomValues() pour le caractère aléatoire cryptographique
   */
  function generateSeedPhrase(wordCount: number = 12): string {
    const randomValues = new Uint8Array(wordCount)
    crypto.getRandomValues(randomValues)

    const words: string[] = []
    for (let i = 0; i < wordCount; i++) {
      const index = randomValues[i] % wordList.length
      words.push(wordList[index])
    }

    return words.join(' ')
  }

  return {
    generateSeedPhrase,
  }
}
