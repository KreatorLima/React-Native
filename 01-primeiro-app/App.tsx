import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text1}>Primeiro app em Typescript!</Text>
      <Text style={styles.text2}>Teste feito no dia 07/08/26</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f3f3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth : 1,
    borderColor : '#3f0101',
    borderRadius : 10,
    margin : 30
  },

  text1:{
    fontSize : 23,
    color : '#3d91ba',
    opacity : 0.8,
    backgroundColor : '#dbdfed',
    borderRadius : 10,
    padding : 10,
    textAlign : 'center',
    margin : 10
  },

  text2:{
    fontSize : 23,
    color : '#05090b',
    opacity : 0.8,
    fontWeight : 'bold',
    backgroundColor : '#eddfdb',
    borderRadius :50,
    padding : 15,
    textAlign : 'center',
    margin : 10,
  }
});
