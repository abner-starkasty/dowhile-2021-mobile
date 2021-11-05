import React, { createContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as AuthSessions from 'expo-auth-session'

import { api } from '../services/api'

const CLIENT_ID = 'e5fd19074e3bf9cd4d51'
const SCOPE = 'read:user'
const AUTH_URL_BASE = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`
const USER_STORAGE_KEY = '@nlwheat:user'
const TOKEN_STORAGE_KEY = '@nlwheat:token'

type User = {
  id: string
  avatar_url: string
  name: string
  login: string
}

type AuthContextData = {
  user: User | null
  isSigningIn: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

type AuthProviderProps = {
  children: React.ReactNode
}

type AuthResponse = {
  token: string
  user: User
}

type AuthorizationResponse = {
  params: {
    code?: string
    error?: string
  }
  type?: string
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [isSigningIn, setIsSigningIn] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  async function signIn() {
    try {
      setIsSigningIn(true)

      const authUrl = `${AUTH_URL_BASE}?client_id=${CLIENT_ID}&scope=${SCOPE}`
      const { params, type } = (await AuthSessions.startAsync({
        authUrl,
      })) as AuthorizationResponse

      if (type === 'success' && params.error !== 'access_denied') {
        const { data } = await api.post<AuthResponse>('/authenticate', {
          code: params.code,
        })
        const { user: userLogged, token } = data

        api.defaults.headers.common.Authorization = `Bearer ${token}`
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userLogged))
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token))

        setUser(userLogged)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSigningIn(false)
    }
  }

  async function signOut() {}

  useEffect(() => {
    async function loadUserStorageData() {
      const userStorage = await AsyncStorage.getItem(USER_STORAGE_KEY)
      const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE_KEY)

      if (userStorage && tokenStorage) {
        api.defaults.headers.common.Authorization = `Bearer ${tokenStorage}`
        setUser(JSON.parse(userStorage))
      }

      setIsSigningIn(false)
    }

    loadUserStorageData()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isSigningIn,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
