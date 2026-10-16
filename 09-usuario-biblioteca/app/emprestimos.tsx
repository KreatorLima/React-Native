import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {View,Text,FlatList,StyleSheet,TouchableOpacity} from 'react-native';

import {collection,getDocs,doc,getDoc} from 'firebase/firestore';

import { db } from '../firebaseConfig';

interface Emprestimo {
  id: string;
  livroId: string;
  nomePessoa: string;
  status: boolean;
  tituloLivro: string;
}

const nomeUsuarioAtual = 'Rene';

export default function Emprestimos() {
  const router = useRouter();

  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);

  async function buscarEmprestimos() {

    try {

      const resultado = await getDocs(
        collection(db, 'emprestimos')
      );

      const lista: Emprestimo[] = [];

      for (const documento of resultado.docs) {

        const dados = documento.data();

        if (dados.nome !== nomeUsuarioAtual) {
          continue;
        }

        const livroRef = doc(
          db,
          'livros',
          dados.livroId
        );

        const livroDoc = await getDoc(livroRef);

        let tituloLivro = 'Livro não encontrado';

        if (livroDoc.exists()) {
          tituloLivro = livroDoc.data().titulo;
        }

        lista.push({
          id: documento.id,
          livroId: dados.livroId,
          nomePessoa: dados.nomePessoa,
          status: dados.status,
          tituloLivro: tituloLivro
        });
      }

      setEmprestimos(lista);

    } catch (erro) {
      console.log('Erro ao buscar empréstimos:', erro);
    }
  }

  useEffect(() => {
    buscarEmprestimos();
  }, []);

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Meus Empréstimos
      </Text>

      <Text style={styles.subtitulo}>
        Confira os livros que você solicitou
      </Text>

      <FlatList
        data={emprestimos}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}

        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.emoji}>📚</Text>

            <Text style={styles.vazioTitulo}>
              Nenhum empréstimo
            </Text>

            <Text style={styles.vazioTexto}>
              Você ainda não solicitou nenhum livro.
            </Text>
          </View>
        }

        renderItem={({ item }) => (

          <View style={styles.card}>

            <View style={styles.livroIcon}>
              <Text style={styles.emojiLivro}>
                📖
              </Text>
            </View>

            <View style={styles.informacoes}>

              <Text style={styles.nomeLivro}>
                {item.tituloLivro}
              </Text>

              <View
                style={[
                  styles.status,
                  item.status
                    ? styles.statusAtivo
                    : styles.statusDevolvido
                ]}
              >

                <Text
                  style={[
                    styles.statusTexto,
                    item.status
                      ? styles.statusTextoAtivo
                      : styles.statusTextoDevolvido
                  ]}
                >
                  {item.status
                    ? '🟠 Não Aprovado'
                    : '🟢 Aprovado'}
                </Text>

              </View>

            </View>

          </View>

        )}
      />

      <View style={styles.tabBar}>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/')}
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

          <Text style={[styles.tabText, styles.tabAtivo]}>
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
    flexDirection: 'row',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    elevation: 4
  },

  livroIcon: {
    width: 55,
    height: 55,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },

  emojiLivro: {
    fontSize: 28
  },

  informacoes: {
    flex: 1
  },

  nomeLivro: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A'
  },

  usuario: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 5,
    marginBottom: 10
  },

  status: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },

  statusAtivo: {
    backgroundColor: '#FFF7ED'
  },

  statusDevolvido: {
    backgroundColor: '#F0FDF4'
  },

  statusTexto: {
    fontSize: 12,
    fontWeight: 'bold'
  },

  statusTextoAtivo: {
    color: '#C2410C'
  },

  statusTextoDevolvido: {
    color: '#15803D'
  },

  vazio: {
    alignItems: 'center',
    marginTop: 100
  },

  emoji: {
    fontSize: 26
  },

  vazioTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 10
  },

  vazioTexto: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 5,
    textAlign: 'center'
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

  tabText: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748B'
  },

  tabAtivo: {
    color: '#2563EB',
    fontWeight: 'bold'
  }

});