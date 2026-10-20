
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native';

// 1. Custom hook: useStopwatch
function useStopwatch(isRunning: boolean): number {
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = setInterval(() => {
      setSeconds((currentSeconds) => currentSeconds + 1);
    }, 1000);

    // Cleanup runs when isRunning changes or the component unmounts.
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  return seconds;
}

// 2. PracticeTracker props
type PracticeTrackerProps = {
  solved: number;
  onSolve: () => void;
  onReset: () => void;
};

// 3. PracticeTracker component
function PracticeTracker({
  solved,
  onSolve,
  onReset,
}: PracticeTrackerProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Practice Progress</Text>

      <Text style={styles.solvedText}>Solved: {solved}</Text>

      {solved >= 5 && (
        <Text style={styles.successText}>Great job!</Text>
      )}

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.button, styles.primaryButton]}
          onPress={onSolve}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Solve +1</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.secondaryButton]}
          onPress={onReset}
          accessibilityRole="button"
        >
          <Text style={styles.darkButtonText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

// 4. Stopwatch props
type StopwatchProps = {
  seconds: number;
  isRunning: boolean;
};

// 5. Stopwatch component
function Stopwatch({ seconds, isRunning }: StopwatchProps) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime =
    `${String(minutes).padStart(2, '0')}:` +
    `${String(remainingSeconds).padStart(2, '0')}`;

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Lab Timer</Text>

      <Text style={styles.timerText}>{formattedTime}</Text>

      <Text
        style={[
          styles.statusText,
          isRunning ? styles.runningText : styles.pausedText,
        ]}
      >
        {isRunning ? 'Running…' : 'Paused'}
      </Text>
    </View>
  );
}

// 6. LabScreen owns the shared state
export default function LabScreen() {
  const [solved, setSolved] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // The parent calls the custom hook and passes its result to Stopwatch.
  const seconds = useStopwatch(isRunning);

  // Functional update prevents using a stale solved count.
  const handleSolve = () => {
    setSolved((s) => s + 1);
  };

  const handleReset = () => {
    setSolved(0);
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <Text style={styles.title}>Lab Timer & Practice Tracker</Text>

        <Text style={styles.subtitle}>
          Track your practice and laboratory time.
        </Text>

        <PracticeTracker
          solved={solved}
          onSolve={handleSolve}
          onReset={handleReset}
        />

        <Stopwatch
          seconds={seconds}
          isRunning={isRunning}
        />

        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.button, styles.startButton]}
            onPress={handleStart}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Start</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.stopButton]}
            onPress={handleStop}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Stop</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

// 7. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 16,
  },
  solvedText: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  successText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#15803D',
    marginBottom: 14,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    marginVertical: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  runningText: {
    color: '#15803D',
  },
  pausedText: {
    color: '#64748B',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    minHeight: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
  },
  secondaryButton: {
    backgroundColor: '#E2E8F0',
  },
  startButton: {
    backgroundColor: '#15803D',
  },
  stopButton: {
    backgroundColor: '#DC2626',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  darkButtonText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
