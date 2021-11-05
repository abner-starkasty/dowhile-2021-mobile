import React, { useState } from 'react'
import { Alert, Keyboard, TextInput, View } from 'react-native'

import { Button } from '../Button'

import { COLORS } from '../../theme'
import { styles } from './styles'
import { api } from '../../services/api'

export function SendMessageForm() {
  const [message, setMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  async function handleMessageSubmit() {
    const messageFormatted = message.trim()

    if (messageFormatted.length > 0) {
      try {
        setSendingMessage(true)

        await api.post('/messages', { message: messageFormatted })

        setMessage('')
        Keyboard.dismiss()

        Alert.alert('Mensagem enviada com sucesso!')
      } catch (error) {
        Alert.alert('Erro ao enviar mensagem. Tente novamente!')
        console.error(error)
      } finally {
        setSendingMessage(false)
      }
    } else {
      Alert.alert('Escreva a mensagem para enviar.')
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        keyboardAppearance="dark"
        placeholder="Qual sua experiência para o evento"
        placeholderTextColor={COLORS.GRAY_PRIMARY}
        multiline
        maxLength={140}
        onChangeText={setMessage}
        value={message}
        style={styles.input}
        editable={!sendingMessage}
      />

      <Button
        title="Enviar Mensagem"
        backgroundColor={COLORS.PINK}
        color={COLORS.WHITE}
        isLoading={sendingMessage}
        onPress={handleMessageSubmit}
      />
    </View>
  )
}
