import { IncomingHttpHeaders } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import firebase from '@lib/firebase';
import Cookies from 'js-cookie';

export async function getCurrentUser(
  cookies: NextApiRequestCookies,
  headers: IncomingHttpHeaders
) {
  const jwt = cookies.jwt;
  console.log(' got jwt ');
  // absolute urls are required by nextjs ,https://stackoverflow.com/a/65556668/3109205
  const protocol = headers['x-forwarded-proto'] || 'http';
  const baseUrl = `${protocol}://${headers['host']}`;

  try {
    const currentUserResponse = await fetch(`${baseUrl}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }).then((res) => res.json());

    return {
      currentUser: currentUserResponse.currentUser,
    };
  } catch (e) {
    console.log(' error fetching current user ', e);
    return {
      currentUser: null,
    };
  }
}

export async function refreshToken() {
  const idToken = await firebase.auth.currentUser?.getIdToken();
  console.log('refresh token ', idToken);
  if (idToken) {
    Cookies.set('jwt', idToken);
  }
}
