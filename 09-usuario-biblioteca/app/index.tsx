import { useEffect, useState } from 'react';

import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter} from 'expo-router';

import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
} from 'firebase/firestore';

import { db } from '../firebaseConfig';

interface Livro {
  id: string;
  titulo: string;
  autor: string;
}

export default function Index() {
  const router = useRouter();

  const usuarioId = '1HidqVWEKKGkN2QJoGfx';
  const [livros, setLivros] = useState<Livro[]>([]);

  async function buscarLivros() {

    const resultado = await getDocs(
      collection(db, 'livros')
    );

    const resultadoUsuarios = await getDocs(
      collection(db, 'usuarios')
    );

    const lista: Livro[] = [];

    resultado.forEach((documento) => {

      const livro = {
        id: documento.id,
        titulo: documento.data().titulo,
        autor: documento.data().autor
      };

      lista.push(livro);
    });

    setLivros(lista);
  }

  async function buscarUsuario() {
    const documento = await getDoc(
      doc(db, 'usuarios', usuarioId)
    );

    if (documento.exists()) {
      return documento.data().nome;
    }

    return null;
  }

  async function solicitarEmprestimo(
    livroId: string,
    titulo: string
  ) {
    try {
      const nomeUsuario = await buscarUsuario();

      if (!nomeUsuario) {
        Alert.alert(
          'Erro',
          'Usuário não encontrado.'
        );
        return;
      }

      await addDoc(
        collection(db, 'emprestimos'),
        {
          livroId: livroId,
          nome: nomeUsuario,
          status: true
        }
      );

      Alert.alert(
        'Sucesso',
        `Empréstimo solicitado para: ${titulo}`
      );

    } catch (erro) {
      Alert.alert(
        'Erro',
        'Não foi possível solicitar o empréstimo.'
      );

      console.log(erro);
    }
  }

  useEffect(() => {
    buscarLivros();
  }, []);

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        📚 Biblioteca
      </Text>

      <Text style={styles.subtitulo}>
        Escolha um livro para solicitar empréstimo
      </Text>

      <FlatList
        data={livros}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: 100
        }}
        renderItem={({ item }) => (

          <View style={styles.card}>

            <Text style={styles.nomeLivro}>
              {item.titulo}
            </Text>

            <Text style={styles.autor}>
              {item.autor}
            </Text>

            <TouchableOpacity
              style={styles.botao}
              onPress={() =>
                solicitarEmprestimo(
                  item.id,
                  item.titulo)
              }
            >
              <Text style={styles.textoBotao}>
                Solicitar Empréstimo
              </Text>
            </TouchableOpacity>

          </View>

        )}
      />

      <View style={styles.tabBar}>

        <TouchableOpacity
          style={styles.tabItem}
        >
          <Text style={styles.emoji}>
            🏠
          </Text>

          <Text style={styles.tabText}>
            Início
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/emprestimos')}
        >
          <Text style={styles.emoji}>
            📖
          </Text>

          <Text style={styles.tabText}>
            Meus Empréstimos
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
    paddingTop: 60,
    paddingHorizontal: 20
  },

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1E293B'
  },

  subtitulo: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 5,
    marginBottom: 20
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3
    },

    shadowOpacity: 0.1,
    shadowRadius: 6,

    elevation: 4
  },

  nomeLivro: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A'
  },

  autor: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 5,
    marginBottom: 15
  },

  botao: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },

  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15
  },

  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    flexDirection: 'row',
    justifyContent: 'space-around',

    backgroundColor: '#FFFFFF',
    paddingVertical: 15,

    borderTopWidth: 1,
    borderTopColor: '#E2E8F0'
  },

  tabItem: {
    alignItems: 'center'
  },

  emoji: {
    fontSize: 26
  },

  tabText: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748B'
  }

});