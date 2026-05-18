export const signInAdapter = (user: any) => ({
  email: user.data.email,
  password: user.data.password
})