import { prisma } from '@/lib/prisma'

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } })

    return user
  } catch {
    return null
  }
}

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } })

    return user
  } catch {
    return null
  }
}

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    return verificationToken
  } catch {
    return null
  }
}

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { email },
    })

    return verificationToken
  } catch {
    return null
  }
}
