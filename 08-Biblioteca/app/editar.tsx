import { useEffect, useState } from 'react';
import {View,Text,TextInput,StyleSheet,Alert,TouchableOpacity
} from 'react-native';

import {
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';

import { db } from '../firebaseConfig';
import {
  useLocalSearchParams,
  useRouter
} from 'expo-router';

export default function Editar() {
  const { id } = useLocalSearchParams();

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  const router = useRouter();

  async function buscarLivro() {
    const documento = await getDoc(
      doc(db, 'livros', id as string)
    );

    if (documento.exists()) {
      setTitulo(documento.data().titulo);
      setAutor(documento.data().autor);
    }
  }

  async function atualizarLivro() {
    await updateDoc(
      doc(db, 'livros', id as string),
      {
        titulo: titulo,
        autor: autor
      }
    );

    Alert.alert(
      'Sucesso',
      'Livro atualizado!'
    );

    router.back();
  }

  useEffect(() => {
    buscarLivro();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.icone}>
          ✏️
        </Text>

        <Text style={styles.titulo}>
          Editar Livro
        </Text>

        <Text style={styles.subtitulo}>
          Atualize as informações do livro.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Título"
          value={titulo}
          onChangeText={setTitulo}
          placeholderTextColor="#94A3B8"
        />

        <TextInput
          style={styles.input}
          placeholder="Autor"
          value={autor}
          onChangeText={setAutor}
          placeholderTextColor="#94A3B8"
        />

        <TouchableOpacity
          style={styles.botao}
          onPress={atualizarLivro}
        >
          <Text style={styles.textoBotao}>
            Salvar Alterações
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
    backgroundColor: '#2563EB',
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