import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { claimPlate } from '@/lib/plates';

export default function ClaimScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [submitting, setSubmitting] = useState(false);

  const handleClaim = async () => {
    setSubmitting(true);
    try {
      await claimPlate(id);
      Alert.alert(
        'Claim Submitted',
        "Your claim is pending review. Once approved, you'll be able to see all reviews and notes left for this plate.",
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not submit claim');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.emoji}>🚗</Text>
      <Text style={styles.title}>Claim This Plate</Text>
      <Text style={styles.sub}>
        Claiming a plate lets you see all reviews and notes other drivers have left for you —
        like a digital tip jar for your driving reputation.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>How it works</Text>
        <Step
          n="1"
          text="Submit a claim — it's marked as Pending."
        />
        <Step
          n="2"
          text="We review claims manually to check for conflicts (two people claiming the same plate)."
        />
        <Step
          n="3"
          text="Once approved, your plate shows a 'Claimed' badge and you receive all messages in your profile."
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚠️ Important</Text>
        <Text style={styles.cardBody}>
          Only claim plates you actually own. False claims may result in account suspension.
          If someone else has already claimed this plate, both claims will be flagged as
          conflicted and reviewed.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={handleClaim}
        disabled={submitting}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>
          {submitting ? 'Submitting...' : 'Submit Claim'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={styles.cancelRow}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Step({ n, text }: { n: string; text: string }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepNum}>
        <Text style={styles.stepNumText}>{n}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: { padding: 24, paddingBottom: 48, alignItems: 'center', gap: 20 },
  emoji: { fontSize: 56, marginTop: 16 },
  title: { fontSize: 26, fontWeight: '800', color: '#fff', textAlign: 'center' },
  sub: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  card: {
    backgroundColor: '#1e1e2e',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    gap: 14,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#fff' },
  cardBody: { fontSize: 13, color: '#aaa', lineHeight: 20 },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7c6ff7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  stepText: { flex: 1, fontSize: 13, color: '#bbb', lineHeight: 20 },
  button: {
    backgroundColor: '#7c6ff7',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    width: '100%',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 17 },
  cancelRow: { paddingVertical: 8 },
  cancelText: { color: '#666', fontSize: 15 },
});
