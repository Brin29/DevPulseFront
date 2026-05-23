export const signInAdapter = (user: any) => ({
  email: user.data.email,
  password: user.data.password
})

export const CheckEmailAdapter = (email: any) => ({
  exists: email.exists,
})