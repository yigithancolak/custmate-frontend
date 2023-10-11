export type LoginResponse = {
  login: {
    accessToken: string
  }
}

export type LoginVariables = {
  email: string
  password: string
}
