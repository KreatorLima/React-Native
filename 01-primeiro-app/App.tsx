// Importação da biblioteca
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function App() {
  // Criamos o estado com o valor inicial "Hello World"
  const [texto, setTexto] = useState('Hello World');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.texto}>{texto}</Text>
      
      <Button 
        title="Clique Aqui" 
        onPress={() => setTexto('Botão Clicado!')} 
      />

      <Button 
        title="Volte ao Valor Inicial" 
        onPress={() => setTexto('Hello World')} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  texto: {
    fontSize: 20,
    marginBottom: 10
  },
});