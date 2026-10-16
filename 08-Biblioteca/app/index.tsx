import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Alert,
  TouchableOpacity, ScrollView
} from 'react-native';
import {
  collection, getDocs, deleteDoc,
  doc, updateDoc
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Livro {
  id: string;
  titulo: string;
  autor: string;
}

interface Emprestimo {
  id: string;
  livroId: string;
  nome: string;
  tituloLivro: string;
}

export default function Index() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [pendentes, setPendentes] = useState(0);
  const [aprovados, setAprovados] = useState(0);
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  async function carregarDados() {
    try {
      const livrosSnap = await getDocs(collection(db, 'livros'));
      const livrosLista = livrosSnap.docs.map(items => ({
        id: items.id,
        titulo: items.data().titulo,
        autor: items.data().autor
      }));

      setLivros(livrosLista);

      const emprestimosSnap = await getDocs(
        collection(db, 'emprestimos')
      );

      let pend = 0;
      let aprov = 0;
      const lista: Emprestimo[] = [];

      emprestimosSnap.docs.forEach(items => {
        const dados = items.data();

        if (dados.status === false) {
          pend++;

          const livro = livrosLista.find(
            l => l.id === dados.livroId
          );

          lista.push({
            id: items.id,
            livroId: dados.livroId,
            nome: dados.nome,
            tituloLivro: livro?.titulo || 'Livro não encontrado'
          });
        } else {
          aprov++;
        }
      });

      setPendentes(pend);
      setAprovados(aprov);
      setEmprestimos(lista);

    } catch (erro) {
      console.log('Erro:', erro);
    }
  }

  async function aprovar(id: string) {
    try {
      await updateDoc(doc(db, 'emprestimos', id), {
        status: true
      });

      Alert.alert('Sucesso', 'Empréstimo aprovado!');
      carregarDados();
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível aprovar.');
    }
  }

  async function recusar(id: string) {
    try {
      await deleteDoc(doc(db, 'emprestimos', id));

      Alert.alert('Sucesso', 'Solicitação recusada!');
      carregarDados();
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível recusar.');
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <View style={styles.tela}>
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>

          <View style={styles.card}>

            <Text style={styles.emoji}>📚</Text>
            <Text style={styles.titulo}>Biblioteca Digital</Text>
            <Text style={styles.subtitulo}>
              Gerencie seus livros de forma simples e organizada.
            </Text>

            <View style={styles.statusContainer}>

              <View style={[styles.statusCard, styles.pendente]}>
                <Text style={styles.numero}>{pendentes}</Text>
                <Text style={styles.statusTitulo}>Pendentes</Text>
                <Text style={styles.descricao}>
                  Aguardando aprovação
                </Text>
              </View>

              <View style={[styles.statusCard, styles.aprovado]}>
                <Text style={styles.numero}>{aprovados}</Text>
                <Text style={styles.statusTitulo}>Aprovados</Text>
                <Text style={styles.descricao}>
                  Empréstimos aprovados
                </Text>
              </View>

            </View>

            <View style={styles.solicitacoes}>

              <Text style={styles.secaoTitulo}>
                Solicitações de Empréstimo
              </Text>

              <Text style={styles.descricao}>
                Aprove ou recuse os empréstimos pendentes.
              </Text>

              {emprestimos.length === 0 ? (
                <View style={styles.vazio}>
                  <Text style={styles.vazioEmoji}>📭</Text>
                  <Text>Nenhuma solicitação pendente.</Text>
                </View>
              ) : (
                emprestimos.map(item => (
                  <View key={item.id} style={styles.emprestimo}>

                    <Text style={styles.livro}>📖</Text>

                    <View style={styles.info}>
                      <Text style={styles.nomeLivro}>
                        {item.tituloLivro}
                      </Text>

                      <Text style={styles.nomePessoa}>
                        Solicitado por: {item.nome}
                      </Text>

                      <Text style={styles.pendenteTexto}>
                        Pendente
                      </Text>

                      <View style={styles.acoes}>

                        <TouchableOpacity
                          style={styles.aprovar}
                          onPress={() => aprovar(item.id)}
                        >
                          <Text style={styles.acaoTexto}>
                            ✓ Aprovar
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.recusar}
                          onPress={() => recusar(item.id)}
                        >
                          <Text style={styles.acaoTexto}>
                            ✕ Recusar
                          </Text>
                        </TouchableOpacity>

                      </View>
                    </View>

                  </View>
                ))
              )}

            </View>

          </View>

        </View>
      </ScrollView>

      {/* Barra de navegação inferior */}
      <View
        style={[
          styles.barra,
          { paddingBottom: Math.max(insets.bottom, 10) }
        ]}
      >
        <TouchableOpacity
          style={styles.barraItem}
          onPress={() => router.push('/cadastro')}
        >
          <Text style={styles.barraIcone}>➕</Text>
          <Text style={styles.barraTexto}>Adicionar Livro</Text>
        </TouchableOpacity>

        <View style={styles.barraDivisor} />

        <TouchableOpacity
          style={styles.barraItem}
          onPress={() => router.push('/livros')}
        >
          <Text style={styles.barraIcone}>📖</Text>
          <Text style={styles.barraTexto}>Ver Livros</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#F4F7FC'
  },

  scroll: {
    flex: 1,
    backgroundColor: '#F4F7FC'
  },

  container: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30
  },

  card: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 6
  },

  emoji: {
    fontSize: 50,
    marginBottom: 10
  },

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1E293B'
  },

  subtitulo: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginVertical: 10
  },

  statusContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginVertical: 15
  },

  statusCard: {
    flex: 1,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center'
  },

  pendente: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA'
  },

  aprovado: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0'
  },

  numero: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B'
  },

  statusTitulo: {
    fontWeight: 'bold',
    color: '#334155'
  },

  descricao: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4
  },

  solicitacoes: {
    width: '100%',
    marginVertical: 15
  },

  secaoTitulo: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#1E293B'
  },

  emprestimo: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 15,
    padding: 15,
    marginTop: 12
  },

  livro: {
    fontSize: 30,
    marginRight: 12
  },

  info: {
    flex: 1
  },

  nomeLivro: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A'
  },

  nomePessoa: {
    fontSize: 13,
    color: '#64748B',
    marginVertical: 5
  },

  pendenteTexto: {
    color: '#C2410C',
    fontSize: 12,
    fontWeight: 'bold'
  },

  acoes: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10
  },

  aprovar: {
    flex: 1,
    backgroundColor: '#16A34A',
    padding: 9,
    borderRadius: 8,
    alignItems: 'center'
  },

  recusar: {
    flex: 1,
    backgroundColor: '#DC2626',
    padding: 9,
    borderRadius: 8,
    alignItems: 'center'
  },

  acaoTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13
  },

  vazio: {
    alignItems: 'center',
    padding: 20,
    marginTop: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 15
  },

  vazioEmoji: {
    fontSize: 30,
    marginBottom: 8
  },

  /* Barra inferior */
  barra: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6
  },

  barraItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4
  },

  barraIcone: {
    fontSize: 22,
    marginBottom: 2
  },

  barraTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155'
  },

  barraDivisor: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4
  }
});