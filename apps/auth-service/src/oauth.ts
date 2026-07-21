import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { generateToken } from './utils';

const prisma = new PrismaClient();

// Github auth
export const githubAuth = {
  getAuthUrl: () => {
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID!,
      redirect_uri: process.env.GITHUB_REDIRECT_URI!,
      scope: 'user:email',
    });
    return `https://github.com/login/oauth/authorize?${params}`;
  },

  exchangeCode: async (code: string) => {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI,
      },
      {
        headers: { Accept: `application/json` },
      }
    );
    return response.data.access_token;
  },

  getUser: async (accessToken: string) => {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: `application/json`,
      },
    });

    const emails = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: `application/json`,
      },
    });

    const primaryEmail = emails.data.find((e: any) => e.primary)?.email || emails.data[0]?.email;

    return {
      id: response.data.id.toString(),
      email: primaryEmail,
      name: response.data.name || response.data.login,
      avatar: response.data.avatar_url,
    };
  },

  handleCallback: async (code: string) => {
    const accessToken = await githubAuth.exchangeCode(code);
    const userData = await githubAuth.getUser(accessToken);

    let user = await prisma.user.findFirst({
      where: {
        OR: [{ provider: 'github', providerId: userData.id }, { email: userData.email }],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          provider: 'github',
          providerId: userData.id,
          password: '',
          emailVerified: true,
        },
      });
    } else if (!user.providerId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          provider: 'github',
          providerId: userData.id,
          avatar: userData.avatar || user.avatar,
        },
      });
    }
    const token = generateToken(user.id, user.email);
    return { user, token };
  },
};

// Google auth
export const googleAuth = {
  getAuthUrl: () => {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  },

  exchangeCode: async (code: string) => {
    const response = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    return response.data.access_token;
  },

  getUser: async (accessToken: string) => {
    const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return {
      id: response.data.id,
      email: response.data.email,
      name: response.data.name,
      avatar: response.data.picture,
    };
  },

  handleCallback: async (code: string) => {
    const accessToken = await googleAuth.exchangeCode(code);
    const userData = await googleAuth.getUser(accessToken);

    let user = await prisma.user.findFirst({
      where: {
        OR: [{ provider: 'google', providerId: userData.id }, { email: userData.email }],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          provider: 'google',
          providerId: userData.id,
          password: '',
          emailVerified: true,
        },
      });
    } else if (!user.providerId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          provider: 'google',
          providerId: userData.id,
          avatar: userData.avatar || user.avatar,
        },
      });
    }

    const token = generateToken(user.id, user.email);
    return { user, token };
  },
};
