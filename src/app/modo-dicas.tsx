import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function ModoDicasScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [matchScore, setMatchScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0); // Contador de dicas usadas na partida
  const [showHintText, setShowHintText] = useState(false); // Mostra ou oculta a dica na tela atual
  const [showSummary, setShowSummary] = useState(false);

  // Banco de perguntas robusto com referências para as dicas
  const fallbackQuestions = [
    { question: "Qual foi o homem mais velho mencionado na Bíblia?", options: ["Noé", "Matusalém", "Adão", "Enoque"], answer: "Matusalém", reference: "Gênesis 5:27" },
    { question: "Qual profeta foi engolido por um grande peixe?", options: ["Isaías", "Elias", "Jonas", "Jeremias"], answer: "Jonas", reference: "Jonas 1:17" },
    { question: "Quem era o rei de Israel conhecido por sua imensa sabedoria?", options: ["Davi", "Saul", "Salomão", "Ezequias"], answer: "Salomão", reference: "1 Reis 4:29" },
    { question: "Quem derrubou as muralhas de Jericó?", options: ["Moisés", "Josué", "Gideão", "Sansão"], answer: "Josué", reference: "Josué 6:20" },
    { question: "Quantos dias e noites choveu durante o dilúvio?", options: ["7", "12", "40", "100"], answer: "40", reference: "Gênesis 7:12" },
    { question: "Quem interpretou os sonhos do Faraó no Egito?", options: ["Moisés", "José", "Daniel", "Jacó"], answer: "José", reference: "Gênesis 41" },
    { question: "Qual era o nome do gigante filisteu derrotado por Davi?", options: ["Golias", "Sansão", "Balaão", "Abimeleque"], answer: "Golias", reference: "1 Samuel 17" },
    { question: "Quem foi lançado na cova dos leões?", options: ["Sadraque", "Elias", "Daniel", "Jeremias"], answer: "Daniel", reference: "Daniel 6" },
    { question: "Qual apóstolo andou sobre as águas com Jesus?", options: ["João", "Tiago", "Pedro", "André"], answer: "Pedro", reference: "Mateus 14:29" },
    { question: "Quem traiu Jesus por 30 moedas de prata?", options: ["Pedro", "Tomé", "Judas Iscariotes", "Mateus"], answer: "Judas Iscariotes", reference: "Mateus 26:15" }
  ].map(q => ({ ...q, options: shuffleArray(q.options) }));

  useEffect(() => {
    // Carrega o modo dicas usando o banco local de alta qualidade
    setLoading(true);
    setTimeout(() => {
      setQuestions(fallbackQuestions);
      setLoading(false);
    }, 600);
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (option: string) => {
    setSelectedAnswer(option);
    const correct = option === currentQuestion?.answer;
    setIsCorrect(correct);
    
    if (correct) {
      setMatchScore(prev => prev + 10); // Cada acerto vale 10 pontos
    }
  };

  const handleUseHint = () => {
    if (!showHintText) {
      setShowHintText(true);
      setHintsUsed(prev => prev + 1); // Soma mais uma dica utilizada
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowHintText(false); // Esconde a dica para a próxima pergunta
    } else {
      setShowSummary(true);
    }
  };

  const finishGameAndSave = async () => {
    setLoading(true);
    // Aplicação da penalidade justa: 2 pontos a menos por cada dica utilizada
    const hintPenalty = hintsUsed * 2;
    const finalScore = Math.max(0, matchScore - hintPenalty); // Garante que nunca fique negativo

    if (auth.currentUser && finalScore > 0) {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          points: increment(finalScore)
        });
      } catch (error) {
        console.error("Erro ao salvar pontos no Firebase:", error);
      }
    }
    router.replace('/dashboard');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Preparando o Modo Dicas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showSummary) {
    const hintPenalty = hintsUsed * 2;
    const finalScore = Math.max(0, matchScore - hintPenalty);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.summaryContainer}>
          <Ionicons name="help-buoy" size={80} color="#3B82F6" style={{ marginBottom: 20 }} />
          <Text style={styles.summaryTitle}>Missão Concluída!</Text>
          <Text style={styles.summaryText}>Você acertou {matchScore / 10} de {questions.length} perguntas.</Text>
          
          <View style={styles.scoreBreakdown}>
            <Text style={styles.breakdownText}>Pontos Brutos: +{matchScore}</Text>
            <Text style={styles.breakdownTextPenalty}>Dicas Usadas ({hintsUsed}): -{hintPenalty}</Text>
          </View>

          <Text style={styles.scoreText}>+{finalScore} Pontos</Text>
          
          <TouchableOpacity style={styles.primaryButton} onPress={finishGameAndSave}>
            <Text style={styles.primaryButtonText}>Salvar e Voltar ao Início</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/dashboard')}>
          <Ionicons name="arrow-back" size={28} color="#F8F9FA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modo Dicas</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>Pergunta {currentIndex + 1} de {questions.length}</Text>
          
          {/* Botão de Dica Estratégica */}
          {!selectedAnswer && (
            <TouchableOpacity style={styles.hintButton} onPress={handleUseHint}>
              <Ionicons name="bulb-outline" size={18} color="#D4AF37" style={{marginRight: 6}} />
              <Text style={styles.hintButtonText}>Pedir Dica (-2 pts)</Text>
            </TouchableOpacity>
          )}
        </View>

        {currentQuestion && (
          <>
            <View style={styles.questionCard}>
              {/* Exibe a dica (referência) apenas se o usuário clicou no botão */}
              {showHintText && (
                <Text style={styles.hintReferenceText}>💡 Dica (Referência): {currentQuestion.reference}</Text>
              )}
              <Text style={styles.questionText}>{currentQuestion.question}</Text>
            </View>

            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option: string, index: number) => (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === option && (isCorrect ? styles.correctOption : styles.wrongOption)
                  ]}
                  onPress={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                >
                  <Text style={styles.optionText}>{optionLetters[index]}) {option}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedAnswer && (
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                  {currentIndex < questions.length - 1 ? "Próxima Pergunta" : "Ver Resultados"}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1128' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderColor: '#1A233A' },
  headerTitle: { color: '#F8F9FA', fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, padding: 20, alignItems: 'center' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, width: '100%', maxWidth: 500 },
  progressText: { color: '#A0AEC0', fontSize: 16, fontWeight: '600' },
  
  hintButton: { flexDirection: 'row', backgroundColor: '#1A233A', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#D4AF37', alignItems: 'center' },
  hintButtonText: { color: '#D4AF37', fontSize: 14, fontWeight: '600' },
  
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#A0AEC0', marginTop: 16, fontSize: 16, fontWeight: '600' },
  
  questionCard: { backgroundColor: '#1A233A', width: '100%', maxWidth: 500, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#2D3748', marginBottom: 30 },
  hintReferenceText: { color: '#3B82F6', fontSize: 14, fontWeight: 'bold', marginBottom: 12 },
  questionText: { color: '#F8F9FA', fontSize: 20, lineHeight: 28 },
  
  optionsContainer: { width: '100%', maxWidth: 500 },
  optionButton: { backgroundColor: '#1A233A', padding: 20, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#2D3748' },
  correctOption: { backgroundColor: '#2E7D32', borderColor: '#2E7D32' },
  wrongOption: { backgroundColor: '#C62828', borderColor: '#C62828' },
  optionText: { color: '#F8F9FA', fontSize: 16 },
  
  nextButton: { backgroundColor: '#3B82F6', width: '100%', maxWidth: 500, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  nextButtonText: { color: '#F8F9FA', fontSize: 16, fontWeight: 'bold' },
  
  summaryContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  summaryTitle: { color: '#F8F9FA', fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
  summaryText: { color: '#A0AEC0', fontSize: 18, marginBottom: 24 },
  scoreBreakdown: { backgroundColor: '#1A233A', padding: 20, borderRadius: 12, width: '100%', maxWidth: 300, marginBottom: 20, borderWidth: 1, borderColor: '#2D3748' },
  breakdownText: { color: '#F8F9FA', fontSize: 16, marginBottom: 8, textAlign: 'center' },
  breakdownTextPenalty: { color: '#EF5350', fontSize: 16, marginBottom: 8, textAlign: 'center' },
  scoreText: { color: '#2E7D32', fontSize: 40, fontWeight: 'bold', marginBottom: 40 },
  primaryButton: { backgroundColor: '#3B82F6', padding: 20, borderRadius: 12, width: '100%', maxWidth: 400, alignItems: 'center' },
  primaryButtonText: { color: '#F8F9FA', fontSize: 18, fontWeight: 'bold' }
});