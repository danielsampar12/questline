import * as React from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Button, Card, Text, ProgressBar, Chip, ActivityIndicator } from "react-native-paper";
import { useLocation } from "../../hooks/useLocation";
import { useQuest } from "../../hooks/useQuest";
import { formatDistance } from "../../utils/locationUtils";

export default function QuestScreen() {
  const { getCurrentLocation, isLoading, error, hasPermission, requestPermission } = useLocation();
  const { currentQuest, progress, checkLocation, startNextQuest, resetProgress } = useQuest();
  const [message, setMessage] = React.useState("Bem-vindo ao App de Missões! Comece sua primeira missão para começar.");

  const handleCheckLocation = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        setMessage("❌ Permissão de localização é necessária para jogar as missões");
        return;
      }
    }

    if (!currentQuest) {
      setMessage("❌ Nenhuma missão ativa. Comece uma missão primeiro!");
      return;
    }

    const location = await getCurrentLocation();
    if (!location) {
      setMessage("❌ Não foi possível obter sua localização. Tente novamente.");
      return;
    }

    const result = await checkLocation(location);
    setMessage(result.message);

    if (result.success) {
      // Show success alert
      Alert.alert(
        "Missão Concluída! 🎉",
        `Você encontrou "${currentQuest.title}"!\n+${currentQuest.points} pontos\n\nTotal de Pontos: ${progress.totalPoints + currentQuest.points}`,
        [
          {
            text: "Próxima Missão",
            onPress: () => {
              startNextQuest();
              setMessage("Nova missão iniciada! Siga a charada para encontrar sua próxima localização.");
            }
          },
          { text: "OK" }
        ]
      );
    }
  };

  const handleStartQuest = () => {
    if (currentQuest) {
      setMessage("Você já tem uma missão ativa! Verifique sua localização para completá-la.");
      return;
    }

    startNextQuest();
    if (progress.completedQuests.length === 0) {
      setMessage("Primeira missão iniciada! Siga a charada para encontrar sua localização alvo.");
    } else {
      setMessage("Nova missão iniciada! Siga a charada para encontrar sua próxima localização.");
    }
  };

  const handleReset = () => {
    Alert.alert(
      "Resetar Progresso",
      "Tem certeza de que deseja resetar todo o seu progresso? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Resetar",
          style: "destructive",
          onPress: () => {
            resetProgress();
            setMessage("Progresso resetado. Comece uma nova missão para começar!");
          }
        }
      ]
    );
  };
  

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Progress Section */}
      <Card style={styles.progressCard}>
        <Card.Title title="Progresso" />
        <Card.Content>
          <View style={styles.progressRow}>
            <Text variant="bodyMedium">Pontos: {progress.totalPoints}</Text>
            <Text variant="bodyMedium">Sequência: {progress.currentStreak}</Text>
          </View>
          <View style={styles.progressRow}>
            <Text variant="bodyMedium">Concluídas: {progress.completedQuests.length}/3</Text>
            <Chip 
              mode="outlined" 
              textStyle={styles.chipText}
            >
              {progress.completedQuests.length === 3 ? "Todas Concluídas!" : "Em Andamento"}
            </Chip>
          </View>
          <ProgressBar 
            progress={progress.completedQuests.length / 3} 
            style={styles.progressBar}
          />
        </Card.Content>
      </Card>

      {/* Current Quest Section */}
      {currentQuest ? (
        <Card style={styles.questCard}>
          <Card.Title 
            title={currentQuest.title}
            subtitle={`${currentQuest.difficulty === 'easy' ? 'FÁCIL' : currentQuest.difficulty === 'medium' ? 'MÉDIO' : 'DIFÍCIL'} • ${currentQuest.points} pontos`}
          />
          <Card.Content>
            <Text variant="bodyLarge" style={styles.riddle}>
              {currentQuest.riddle}
            </Text>
            {currentQuest.hint && (
              <Text variant="bodyMedium" style={styles.hint}>
                💡 Dica: {currentQuest.hint}
              </Text>
            )}
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={handleCheckLocation}
              loading={isLoading}
              disabled={isLoading}
              style={styles.actionButton}
            >
              {isLoading ? "Verificando..." : "Verificar Localização"}
            </Button>
          </Card.Actions>
        </Card>
      ) : (
        <Card style={styles.questCard}>
          <Card.Title title="Nenhuma Missão Ativa" />
          <Card.Content>
            <Text variant="bodyMedium">
              {progress.completedQuests.length === 3 
                ? "🎉 Parabéns! Você concluiu todas as missões!"
                : "Comece uma nova missão para iniciar sua aventura!"
              }
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={handleStartQuest}
              disabled={progress.completedQuests.length === 3}
              style={styles.actionButton}
            >
              {progress.completedQuests.length === 3 ? "Todas Concluídas!" : "Iniciar Missão"}
            </Button>
          </Card.Actions>
        </Card>
      )}

      {/* Status Message */}
      <Card style={styles.messageCard}>
        <Card.Content>
          <Text variant="bodyMedium" style={styles.message}>
            {error ? `❌ ${error}` : message}
          </Text>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" />
              <Text variant="bodySmall" style={styles.loadingText}>
                Obtendo sua localização...
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <Button 
          mode="outlined" 
          onPress={handleReset}
          style={styles.resetButton}
        >
          Resetar Progresso
        </Button>
        {!hasPermission && (
          <Button 
            mode="contained-tonal" 
            onPress={requestPermission}
            style={styles.permissionButton}
          >
            Ativar Localização
          </Button>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  progressCard: {
    marginBottom: 16,
  },
  questCard: {
    marginBottom: 16,
  },
  messageCard: {
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    marginTop: 8,
  },
  riddle: {
    fontStyle: 'italic',
    marginBottom: 12,
    lineHeight: 24,
  },
  hint: {
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  message: {
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  resetButton: {
    flex: 1,
  },
  permissionButton: {
    flex: 1,
  },
  chipText: {
    fontSize: 12,
  },
});
