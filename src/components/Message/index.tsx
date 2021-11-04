import React from 'react'

import { Text, View } from 'react-native'
import { UserPhoto } from '../UserPhoto'

import { styles } from './styles'

export type MessageData = {
  id: string
  text: string
  user: {
    name: string
    avatar_url: string
  }
}

type MessageProps = {
  data: MessageData
}

export function Message({ data }: MessageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{data.text}</Text>

      <View style={styles.footer}>
        <UserPhoto imageUri={data.user.avatar_url} sizes="SMALL" />

        <Text style={styles.userName}>{data.user.name}</Text>
      </View>
    </View>
  )
}
