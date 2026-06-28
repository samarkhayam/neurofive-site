import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // On first sign-in, user object is available
      if (account && user) {
        token.email = user.email
        token.image = user.image
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      // Pass token fields into session
      if (token) {
        session.user.email = token.email
        session.user.image = token.image
        session.user.name = token.name
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})