// randomUtils.ts

export const getRandomChar = (characters: string): string => {
  const randomIndex = Math.floor(Math.random() * characters.length)
  return characters[randomIndex]
}

export const getRandomCharacter = (): string => {
  const characters = '0123456789abcdef'
  const segments = [8, 4, 4, 4, 12]

  let result = ''

  segments.forEach((segment, index) => {
    for (let i = 0; i < segment; i++) {
      if (i === 0 && index !== 0) {
        result += '-'
      }
      result += getRandomChar(characters)
    }
  })

  return result
}
