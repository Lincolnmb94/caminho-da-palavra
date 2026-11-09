import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    // Esconde o cabeçalho padrão para termos controle total do design
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}