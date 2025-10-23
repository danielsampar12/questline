import * as React from "react";
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { Button, Card, Text, ProgressBar, Chip, ActivityIndicator } from "react-native-paper";
import { useLocation } from "../../hooks/useLocation";
import { useQuest } from "../../hooks/useQuest";

export default function QuestScreen() {
  const { getCurrentLocation, isLoading, error, hasPermission, requestPermission } = useLocation();
  const { currentQuest, progress, checkLocation, startNextQuest, resetProgress, completeQuest } = useQuest();
  const [message, setMessage] = React.useState("Bem-vinda à nossa história! Vamos reviver os momentos mais especiais que vivemos juntos.");
  const [debugMode, setDebugMode] = React.useState(false);
  const [tapCount, setTapCount] = React.useState(0);

  // Função para ativar modo debug (toque triplo no título)
  const handleTitlePress = () => {
    setTapCount(prev => prev + 1);
    setTimeout(() => setTapCount(0), 1000);
    
    if (tapCount === 2) { // Terceiro toque
      setDebugMode(!debugMode);
      setMessage(debugMode ? "Modo debug desativado" : "🔧 Modo debug ativado");
    }
  };

  // Função para pular missão atual (modo debug)
  const handleSkipQuest = () => {
    if (!currentQuest) return;
    
    Alert.alert(
      "Pular Missão",
      `Tem certeza que deseja pular "${currentQuest.title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Pular",
            onPress: () => {
              // Completar a missão atual IMEDIATAMENTE
              completeQuest(currentQuest.id);
              
              // Mostrar alerta de sucesso
              Alert.alert(
                "Memória Encontrada! 🎈",
                `Você encontrou "${currentQuest.title}"!\n+${currentQuest.points} pontos\n\nTotal de Pontos: ${progress.totalPoints + currentQuest.points}`,
                [
                  {
                    text: "Próxima Memória",
                    onPress: () => {
                      console.log('🔧 DEBUG: Iniciando próxima missão');
                      // Aguardar um pouco para o estado ser atualizado
                      setTimeout(() => {
                        startNextQuest();
                        setMessage("Nova memória desbloqueada! Vamos continuar nossa história.");
                      }, 100);
                    }
                  },
                  { text: "OK" }
                ]
              );
            }
        }
      ]
    );
  };

  const handleCheckLocation = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        setMessage("❌ Permissão de localização é necessária para nossa história");
        return;
      }
    }

    if (!currentQuest) {
      setMessage("❌ Nenhuma memória ativa. Vamos reviver nossa história!");
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
        "Memória Encontrada! 🎈",
        `Você encontrou "${currentQuest.title}"!\n+${currentQuest.points} pontos\n\nTotal de Pontos: ${progress.totalPoints + currentQuest.points}`,
        [
          {
            text: "Próxima Memória",
            onPress: () => {
              // Aguardar um pouco para o estado ser atualizado
              setTimeout(() => {
                startNextQuest();
                setMessage("Nova memória desbloqueada! Vamos continuar nossa história.");
              }, 100);
            }
          },
          { text: "OK" }
        ]
      );
    }
  };

  const handleStartQuest = () => {
    if (currentQuest) {
      setMessage("Você já tem uma memória ativa! Vamos encontrar esse local especial juntos.");
      return;
    }

    startNextQuest();
    if (progress.completedQuests.length === 0) {
      setMessage("Primeira memória desbloqueada! Vamos reviver nosso primeiro momento especial.");
    } else {
      setMessage("Nova memória desbloqueada! Vamos continuar nossa história.");
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

  const getButtonText = () => {
    if (progress.completedQuests.length === 5) {
      return "História Completa!";
    }

    return progress.completedQuests.length === 0 ? "Iniciar História" : "Continuar História";
  }
  

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Progress Section */}
      <Card style={styles.progressCard}>
        <TouchableOpacity onPress={handleTitlePress}>
          <Card.Title title="Nossa História" />
        </TouchableOpacity>
        <Card.Content>
          <View style={styles.progressRow}>
            <Text variant="bodyMedium">Pontuação: {progress.totalPoints}</Text>
            <Text variant="bodyMedium">Memórias: {progress.currentStreak}</Text>
          </View>
          <View style={styles.progressRow}>
            <Text variant="bodyMedium">Revividas: {progress.completedQuests.length}/5</Text>
            <Chip 
              mode="outlined" 
              textStyle={styles.chipText}
            >
              {progress.completedQuests.length === 5 ? "Jornada Completa!" : "Em Andamento"}
            </Chip>
          </View>
          <ProgressBar 
            progress={progress.completedQuests.length / 5} 
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
              {isLoading ? "Verificando..." : "Cheguei!"}
            </Button>
            {debugMode && (
              <Button 
                mode="outlined" 
                onPress={handleSkipQuest}
                style={[styles.actionButton, { backgroundColor: '#ffeb3b', borderColor: '#ffeb3b' }]}
                textColor="#000"
              >
                🔧 Pular
              </Button>
            )}
          </Card.Actions>
        </Card>
      ) : (
        <Card style={styles.questCard}>
          <Card.Title title="Nenhuma Memória Ativa" />
          <Card.Content>
            <Text variant="bodyMedium">
              {progress.completedQuests.length === 5 
                ? "💕 Nossa história está completa! Revivemos todos os momentos especiais que vivemos juntos. Agora você tem uma pergunta muito especial para responder..."
                : "Vamos começar nossa história! Reviva os momentos mais especiais que vivemos juntos."
              }
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={handleStartQuest}
              disabled={progress.completedQuests.length === 5}
              style={styles.actionButton}
            >
              {getButtonText()}
            </Button>
          </Card.Actions>
        </Card>
      )}

      {/* Debug Indicator */}
      {debugMode && (
        <Card style={[styles.messageCard, { backgroundColor: '#fff3cd', borderColor: '#ffeb3b' }]}>
          <Card.Content>
            <Text variant="bodySmall" style={{ color: '#856404', textAlign: 'center' }}>
              🔧 Modo Debug Ativo - Toque triplo no título para desativar
            </Text>
          </Card.Content>
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
        {debugMode && (
          <Button 
          mode="outlined" 
          onPress={handleReset}
          style={styles.resetButton}
          >
            Resetar Progresso
          </Button>
        )}
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
