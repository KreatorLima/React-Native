import { useEffect, useState } from 'react';
import {View,Text,FlatList,StyleSheet,Alert,TouchableOpacity
} from 'react-native';

import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore';

import { db } from '../firebaseConfig';
import { useRouter } from 'expo-router';

interface Livro {
  id: string;
  titulo: string;
  autor: string;
}

export default function Index() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const router = useRouter();

  async function buscarLivros() {
    const resultado = await getDocs(
      collection(db, 'livros')
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

  async function removerLivro(id: string) {
    await deleteDoc(
      doc(db, 'livros', id)
    );

    Alert.alert(
      'Sucesso',
      'Livro excluído!'
    );

    buscarLivros();
  }

  function editarLivro(id: string) {
    router.push({
      pathname: '/editar',
      params: {
        id: id
      }
    });
  }

  useEffect(() => {
    buscarLivros();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        📚 Livros Cadastrados
      </Text>

      <FlatList
        data={livros}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nomeLivro}>
              {item.titulo}
            </Text>

            <Text style={styles.autor}>
              ✍️ {item.autor}
            </Text>

            <View style={styles.botoes}>
              <TouchableOpacity
                style={[styles.botao, styles.editar]}
                onPress={() => editarLivro(item.id)}
              >
                <Text style={styles.textoBotao}>
                  Editar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botao, styles.excluir]}
                onPress={() => removerLivro(item.id)}
              >
                <Text style={styles.textoBotao}>
                  Excluir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
    padding: 20,
    paddingTop: 60
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 6
  },

  autor: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 15
  },

  botoes: {
    flexDirection: 'row',
    gap: 10
  },

  botao: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },

  editar: {
    backgroundColor: '#F59E0B'
  },

  excluir: {
    backgroundColor: '#EF4444'
  },

  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15
  }
});