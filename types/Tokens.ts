type Token = {
  address: string
  name: string
  symbol: string
  weight: string
}

type TokensJson = {
  tokens: Array<Token>
}

export { Token, TokensJson }
