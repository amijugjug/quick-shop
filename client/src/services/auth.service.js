import {
  deleteCookie,
  setCookie,
  getCookie,
} from './helpers/storageHelpers/cookie.helper';
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from './helpers/storageHelpers/localstorage.helper';
import { registerUser } from '../api/registerUser.api';
import { USERS_DB } from '../constants';
// import { decodeToken } from 'react-jwt';

export const login = async (
  formData,
  navigateTo,
  pathToNavigate,
  pushToast
) => {
  try {
    // Using local storage for login
    const localToken = formData.username;
    const existingUsers = JSON.parse(getLocalStorageItem(USERS_DB));
    if (
      existingUsers &&
      Object.prototype.hasOwnProperty.call(existingUsers, localToken)
    ) {
      setCookie('token', localToken, 7);
    } else {
      pushToast('error', 'User is not registered');
      throw new Error(`User is not registerd`);
    }

    // In case if the backend support is enabled
    // const token = await getToken(formData);
    // setCookie('token', token, 7);
  } catch (error) {
    console.error(`Failed to login user:`, error?.response?.data);
    return {
      errors: {
        username: 'There was an error with this username',
        password: 'There was an error with this password',
      },
      message: error?.response?.data,
    };
  }
  navigateTo(pathToNavigate);
};

export const logout = async (navigateTo) => {
  deleteCookie('token');
  deleteCookie('id');
  navigateTo('/');
};

export const register = async (formData, navigate, pathToNavigate) => {
  const constructNewUser = (formData) => {
    const token = formData.username;
    return {
      ...formData,
      token,
      wishlist: {},
      previousorders: {},
      cart: {},
      totalCartItemCount: 0,
    };
  };
  try {
    const id = await registerUser(formData);
    setCookie('id', id, 7);

    const newUser = constructNewUser(formData);
    const { token } = newUser;

    // Storing the new users to local storage because they api is not available currrently.
    const existingUsers = JSON.parse(getLocalStorageItem(USERS_DB));
    if (existingUsers) {
      if (Object.prototype.hasOwnProperty.call(existingUsers, token)) {
        throw new Error(`Username : ${formData.username} is not available`);
      }
      setLocalStorageItem(
        USERS_DB,
        JSON.stringify({ ...existingUsers, [token]: newUser })
      );
    } else {
      setLocalStorageItem(USERS_DB, JSON.stringify({ [token]: newUser }));
    }
    setCookie('token', token, 7);
    navigate(pathToNavigate);
  } catch (error) {
    console.error(`Failed to register user:`, error);
    return {
      errors: {
        username: 'There was an error with this username',
        password: 'There was an error with this password',
      },
      message: error?.response?.data,
    };
  }
};

export const verifySession = () => {
  const token = getCookie('token');

  if (!token) {
    window.location.href = '/login';
  }

  // let decoded = null;
  // if (token) {
  //   decoded = decodeToken(token);
  // }
  // // Redirect to login page if the user is not authenticated
  // if (!decoded?.user) {
  //   window.location.href = '/login';
  // }

  // const userId = Number(decoded?.sub);

  return { isAuth: true };
};

export const getUserFromLS = (username) => {
  const users_db = JSON.parse(getLocalStorageItem(USERS_DB));
  if (!users_db) return false;

  const user = users_db[username];
  if (!user) return false;

  return user;
};

export const checkValidUser = (username) => {
  const decryptedUserName = username;
  const user = getUserFromLS(decryptedUserName);
  const currentLoggedInUser = getCookie('token');
  if (currentLoggedInUser === decryptedUserName) return user;
  return null;
};

export const isUserLoggedIn = () => {
  const token = getCookie('token');
  return !!token;
};
