import { useState } from 'react';
import {View,Text,TextInput,StyleSheet,Alert,TouchableOpacity
} from 'react-native';

import {
  collection,
  addDoc
} from 'firebase/firestore';

import { db } from '../firebaseConfig';
import { useRouter } from 'expo-router';

export default function Cadastro() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  const router = useRouter();

  async function salvarLivro() {
    if (titulo === '' || autor === '') {
      Alert.alert(
        'Atenção',
        'Preencha todos os campos!'
      );
      return;
    }

    await addDoc(
      collection(db, 'livros'),
      {
        titulo: titulo,
        autor: autor
      }
    );

    Alert.alert(
      'Sucesso',
      'Livro cadastrado!'
    );

    router.back();
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.icone}>
          📖
        </Text>

        <Text style={styles.titulo}>
          Cadastrar Livro
        </Text>

        <Text style={styles.subtitulo}>
          Adicione um novo livro à biblioteca.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Título do livro"
          placeholderTextColor="#94A3B8"
          value={titulo}
          onChangeText={setTitulo}
        />

        <TextInput
          style={styles.input}
          placeholder="Nome do autor"
          placeholderTextColor="#94A3B8"
          value={autor}
          onChangeText={setAutor}
        />

        <TouchableOpacity
          style={styles.botao}
          onPress={salvarLivro}
        >
          <Text style={styles.textoBotao}>
            Salvar Livro
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
    justifyContent: 'center',
    padding: 20
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,

    elevation: 6
  },

  icone: {
    fontSize: 50,
    textAlign: 'center',
    marginBottom: 10
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8
  },

  subtitulo: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 25
  },

  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 15,
    color: '#1E293B'
  },

  botao: {
    backgroundColor: '#22C55E',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  }
});