import { v4 as uuidv4 } from 'uuid'
import { getVerificationTokenByEmail } from './common'
import { prisma } from '@/lib/prisma'

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getVerificationTokenByEmail(email)

  // If a token already exists for this email, delete it
  // to ensure that only one token is valid at a time
  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    })
  }

  const verficationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  })

  return verficationToken
}
