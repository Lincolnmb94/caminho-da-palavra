import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase'; 

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const tempName = userCredential.user.email?.split('@')[0] || 'Visitante';
      
      router.replace({ pathname: '/dashboard', params: { userName: tempName } });
    } catch (error: any) {
      console.error(error);
      alert('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Caminho da Palavra</Text>
            <Text style={styles.subtitle}>O seu caminho de aprendizado bíblico</Text>
          </View>

          <View style={styles.formContainer}>
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
              placeholder="Senha"
              placeholderTextColor="#8892B0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.googleButton}>
              <Text style={styles.googleButtonText}>Continuar com o Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkButton} onPress={handleRegister}>
              <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
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
  primaryButton: { backgroundColor: '#1E3A8A', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  googleButton: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 24 },
  googleButtonText: { color: '#333333', fontSize: 16, fontWeight: '600' },
  linkButton: { alignItems: 'center' },
  linkText: { color: '#D4AF37', fontSize: 14, fontWeight: '600' }
});