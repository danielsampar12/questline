import * as React from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Button, Card, Text, ProgressBar, Chip, ActivityIndicator } from "react-native-paper";
import { useLocation } from "../../hooks/useLocation";
import { useQuest } from "../../hooks/useQuest";
import { formatDistance } from "../../utils/locationUtils";

export default function QuestScreen() {
  const { getCurrentLocation, isLoading, error, hasPermission, requestPermission } = useLocation();
  const { currentQuest, progress, checkLocation, startNextQuest, resetProgress } = useQuest();
  const [message, setMessage] = React.useState("Welcome to the Quest App! Start your first quest to begin.");

  const handleCheckLocation = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        setMessage("❌ Location permission is required to play quests");
        return;
      }
    }

    if (!currentQuest) {
      setMessage("❌ No active quest. Please start a quest first!");
      return;
    }

    const location = await getCurrentLocation();
    if (!location) {
      setMessage("❌ Could not get your location. Please try again.");
      return;
    }

    const result = await checkLocation(location);
    setMessage(result.message);

    if (result.success) {
      // Show success alert
      Alert.alert(
        "Quest Complete! 🎉",
        `You found "${currentQuest.title}"!\n+${currentQuest.points} points\n\nTotal Points: ${progress.totalPoints + currentQuest.points}`,
        [
          {
            text: "Start Next Quest",
            onPress: () => {
              startNextQuest();
              setMessage("New quest started! Follow the riddle to find your next location.");
            }
          },
          { text: "OK" }
        ]
      );
    }
  };

  const handleStartQuest = () => {
    if (currentQuest) {
      setMessage("You already have an active quest! Check your location to complete it.");
      return;
    }

    startNextQuest();
    if (progress.completedQuests.length === 0) {
      setMessage("First quest started! Follow the riddle to find your target location.");
    } else {
      setMessage("New quest started! Follow the riddle to find your next location.");
    }
  };

  const handleReset = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset all your progress? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetProgress();
            setMessage("Progress reset. Start a new quest to begin!");
          }
        }
      ]
    );
  };
  

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Progress Section */}
      <Card style={styles.progressCard}>
        <Card.Title title="Progress" />
        <Card.Content>
          <View style={styles.progressRow}>
            <Text variant="bodyMedium">Points: {progress.totalPoints}</Text>
            <Text variant="bodyMedium">Streak: {progress.currentStreak}</Text>
          </View>
          <View style={styles.progressRow}>
            <Text variant="bodyMedium">Completed: {progress.completedQuests.length}/3</Text>
            <Chip 
              mode="outlined" 
              textStyle={styles.chipText}
            >
              {progress.completedQuests.length === 3 ? "All Complete!" : "In Progress"}
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
            subtitle={`${currentQuest.difficulty.toUpperCase()} • ${currentQuest.points} points`}
          />
          <Card.Content>
            <Text variant="bodyLarge" style={styles.riddle}>
              {currentQuest.riddle}
            </Text>
            {currentQuest.hint && (
              <Text variant="bodyMedium" style={styles.hint}>
                💡 Hint: {currentQuest.hint}
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
              {isLoading ? "Checking..." : "Check Location"}
            </Button>
          </Card.Actions>
        </Card>
      ) : (
        <Card style={styles.questCard}>
          <Card.Title title="No Active Quest" />
          <Card.Content>
            <Text variant="bodyMedium">
              {progress.completedQuests.length === 3 
                ? "🎉 Congratulations! You've completed all quests!"
                : "Start a new quest to begin your adventure!"
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
              {progress.completedQuests.length === 3 ? "All Complete!" : "Start Quest"}
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
                Getting your location...
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
          Reset Progress
        </Button>
        {!hasPermission && (
          <Button 
            mode="contained-tonal" 
            onPress={requestPermission}
            style={styles.permissionButton}
          >
            Enable Location
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
