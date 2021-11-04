import React from 'react';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { UserPhoto } from '../UserPhoto';

import { styles } from './styles';

import Logo from '../../assets/logo.svg'

export function Header() {
  return (
    <View style={styles.container}>
      <Logo />

      <View style={styles.logoutButton}>
        <TouchableOpacity>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>

        <UserPhoto imageUri='https://github.com/abner-starkasty.png' />
      </View>

    </View>
  );
}