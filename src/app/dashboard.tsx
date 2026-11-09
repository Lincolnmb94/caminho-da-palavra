import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';

export default function DashboardScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [userName, setUserName] = useState(params.userName || 'Visitante');
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setPoints(userData.points || 0);
            if (userData.nickname) setUserName(userData.nickname);
          }
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.innerContainer}>
          
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Olá, {userName}</Text>
              <Text style={styles.peaceText}>A Paz do Senhor!</Text>
            </View>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={24} color="#0A1128" />
            </View>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Seus Pontos</Text>
            <View style={styles.statsRow}>
              {loading ? (
                <ActivityIndicator color="#D4AF37" size="large" />
              ) : (
                <Text style={styles.statsValue}>{points}</Text>
              )}
              <Ionicons name="star" size={24} color="#D4AF37" style={{ marginLeft: 8 }} />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Modos de Jogo</Text>
          
          {/* Botão para Contra o Tempo */}
          <TouchableOpacity style={styles.gameModeCard} onPress={() => router.push('/quiz')}>
            <View style={styles.iconContainer}>
              <Ionicons name="timer-outline" size={32} color="#0A1128" />
            </View>
            <View style={styles.gameModeTextContainer}>
              <Text style={styles.gameModeTitle}>Contra o Tempo</Text>
              <Text style={styles.gameModeDesc}>Responda 10 perguntas rápido e ganhe bônus</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#A0AEC0" />
          </TouchableOpacity>

          {/* Botão para o Modo Dicas */}
          <TouchableOpacity style={styles.gameModeCard} onPress={() => router.push('/modo-dicas')}>
            <View style={[styles.iconContainer, { backgroundColor: '#3B82F6' }]}>
              <Ionicons name="help-buoy-outline" size={32} color="#F8F9FA" />
            </View>
            <View style={styles.gameModeTextContainer}>
              <Text style={styles.gameModeTitle}>Modo Dicas</Text>
              <Text style={styles.gameModeDesc}>Sem pressa, mas com auxílios (custa 2 pts por dica)</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#A0AEC0" />
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Comunidade & Loja</Text>
          
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="trophy-outline" size={28} color="#D4AF37" />
              <Text style={styles.actionButtonText}>Ranking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="people-outline" size={28} color="#F8F9FA" />
              <Text style={styles.actionButtonText}>Amigos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="storefront-outline" size={28} color="#F8F9FA" />
              <Text style={styles.actionButtonText}>Loja</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1128' },
  scrollContent: { flexGrow: 1, alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  innerContainer: { width: '100%', maxWidth: 400 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  greeting: { color: '#A0AEC0', fontSize: 18 },
  peaceText: { color: '#D4AF37', fontSize: 26, fontWeight: 'bold', marginTop: 4 },
  avatarPlaceholder: { width: 50, height: 50, backgroundColor: '#D4AF37', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  statsCard: { backgroundColor: '#1E3A8A', borderRadius: 16, padding: 24, marginBottom: 40, alignItems: 'center' },
  statsTitle: { color: '#A0AEC0', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statsValue: { color: '#FFFFFF', fontSize: 36, fontWeight: 'bold' },
  sectionTitle: { color: '#F8F9FA', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  gameModeCard: { backgroundColor: '#1A233A', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#2D3748' },
  iconContainer: { width: 48, height: 48, backgroundColor: '#D4AF37', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  gameModeTextContainer: { flex: 1 },
  gameModeTitle: { color: '#F8F9FA', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  gameModeDesc: { color: '#A0AEC0', fontSize: 14 },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  actionButton: { backgroundColor: '#1A233A', borderRadius: 12, paddingVertical: 20, paddingHorizontal: 12, alignItems: 'center', width: '31%', borderWidth: 1, borderColor: '#2D3748' },
  actionButtonText: { color: '#F8F9FA', fontSize: 14, fontWeight: '600', marginTop: 8 }
});