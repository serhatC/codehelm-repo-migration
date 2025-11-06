
import { NextAuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import GitLabProvider from 'next-auth/providers/gitlab'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          isPremium: user.isPremium,
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
      authorization: {
        params: {
          // Request repo scope for repository access
          scope: 'read:user user:email repo'
        }
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          firstName: profile.name?.split(' ')[0] || profile.login,
          lastName: profile.name?.split(' ').slice(1).join(' ') || '',
          isPremium: false,
        }
      }
    }),
    GitLabProvider({
      clientId: process.env.GITLAB_ID || '',
      clientSecret: process.env.GITLAB_SECRET || '',
      authorization: {
        params: {
          // Request API scope for repository access
          scope: 'read_user read_api api'
        }
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.username,
          email: profile.email,
          image: profile.avatar_url,
          firstName: profile.name?.split(' ')[0] || profile.username,
          lastName: profile.name?.split(' ').slice(1).join(' ') || '',
          isPremium: false,
        }
      }
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.id = user.id
        token.isPremium = (user as any).isPremium
      }
      // Store access token for GitHub/GitLab API calls
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string
        session.user.isPremium = token.isPremium as boolean
        session.accessToken = token.accessToken as string
        session.provider = token.provider as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    verifyRequest: '/auth/verify-request',
  }
}

export const getAuth = () => getServerSession(authOptions)
