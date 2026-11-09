import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase'; // A nossa ligação ao Firebase

export default function RegisterScreen() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleRegister = async () => {
    if (!nickname || !email || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      // 1. Cria a conta no sistema de Autenticação do Google
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Guarda o Nickname e a pontuação inicial (0) na base de dados Firestore
      await setDoc(doc(db, 'users', user.uid), {
        nickname: nickname,
        email: email,
        points: 0,
        createdAt: serverTimestamp(),
      });
      
      // 3. Redireciona para o Dashboard com o novo apelido
      router.replace({ pathname: '/dashboard', params: { userName: nickname } });
    } catch (error: any) {
      console.error(error);
      alert('Erro ao criar conta. O e-mail pode já estar em uso ou a palavra-passe é muito fraca (mínimo de 6 caracteres).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Junte-se ao Caminho da Palavra</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Apelido (Nickname)"
              placeholderTextColor="#8892B0"
              value={nickname}
              onChangeText={setNickname}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#8892B0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Palavra-passe (Mínimo 6 caracteres)"
              placeholderTextColor="#8892B0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Registar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkButton} onPress={() => router.back()}>
              <Text style={styles.linkText}>Já tem uma conta? Iniciar sessão</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1128' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  innerContainer: { width: '100%', maxWidth: 400, alignItems: 'center' },
  headerContainer: { alignItems: 'center', marginBottom: 50 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#F8F9FA', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#A0AEC0' },
  formContainer: { width: '100%' },
  input: { backgroundColor: '#1A233A', borderWidth: 1, borderColor: '#2D3748', borderRadius: 8, padding: 16, marginBottom: 16, fontSize: 16, color: '#F8F9FA' },
  primaryButton: { backgroundColor: '#D4AF37', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 24 }, // Dourado para o registo
  primaryButtonText: { color: '#0A1128', fontSize: 16, fontWeight: 'bold' },
  linkButton: { alignItems: 'center' },
  linkText: { color: '#A0AEC0', fontSize: 14, fontWeight: '600' }
});