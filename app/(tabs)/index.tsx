import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { findOrCreatePlate } from '@/lib/plates';

export default function HomeScreen() {
  const [manualPlate, setManualPlate] = useState('');
  const [manualState, setManualState] = useState('');
  const [searching, setSearching] = useState(false);

  const handleScan = () => {
    router.push('/camera');
  };

  const handleManualSearch = async () => {
    const plate = manualPlate.trim().toUpperCase();
    const state = manualState.trim().toUpperCase();
    if (!plate || !state || state.length !== 2) {
      Alert.alert('Enter plate number and 2-letter state code (e.g. CA)');
      return;
    }
    setSearching(true);
    try {
      const found = await findOrCreatePlate(plate, state);
      router.push(`/plate/${found.id}`);
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setSearching(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🚗💨</Text>
          <Text style={styles.heroTitle}>PlateMatch</Text>
          <Text style={styles.heroSubtitle}>
            Rate drivers. Send notes. Hold each other accountable.
          </Text>
        </View>

        {/* Scan CTA */}
        <TouchableOpacity style={styles.scanButton} onPress={handleScan} activeOpacity={0.85}>
          <Text style={styles.scanButtonEmoji}>📷</Text>
          <View>
            <Text style={styles.scanButtonTitle}>Scan a License Plate</Text>
            <Text style={styles.scanButtonSub}>Point your camera at any plate</Text>
          </View>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or search manually</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Manual search */}
        <View style={styles.manualSearch}>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Plate number"
              placeholderTextColor="#555"
              value={manualPlate}
              onChangeText={setManualPlate}
              autoCapitalize="characters"
              maxLength={10}
            />
            <TextInput
              style={[styles.input, { width: 70 }]}
              placeholder="State"
              placeholderTextColor="#555"
              value={manualState}
              onChangeText={setManualState}
              autoCapitalize="characters"
              maxLength={2}
            />
          </View>
          <TouchableOpacity
            style={[styles.searchButton, searching && styles.searchButtonDisabled]}
            onPress={handleManualSearch}
            disabled={searching}
            activeOpacity={0.8}
          >
            <Text style={styles.searchButtonText}>
              {searching ? 'Searching...' : 'Search'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info cards */}
        <View style={styles.infoCards}>
          <InfoCard
            emoji="⭐"
            title="Rate Any Driver"
            body="0–5 stars plus emoji tags like safe, speeder, courteous, and more."
          />
          <InfoCard
            emoji="💬"
            title="Send a Note"
            body="Leave helpful tips like 'broken tail light' without confrontation."
          />
          <InfoCard
            emoji="🔒"
            title="Claim Your Plate"
            body="Own your plate to see messages drivers have left for you."
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InfoCard({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoCardEmoji}>{emoji}</Text>
      <Text style={styles.infoCardTitle}>{title}</Text>
      <Text style={styles.infoCardBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 48,
    gap: 24,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 16,
    gap: 8,
  },
  heroEmoji: {
    fontSize: 48,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 22,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#7c6ff7',
    borderRadius: 16,
    padding: 20,
  },
  scanButtonEmoji: {
    fontSize: 32,
  },
  scanButtonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  scanButtonSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2a2a3e',
  },
  dividerText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  manualSearch: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
    fontFamily: 'monospace',
  },
  searchButton: {
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7c6ff7',
  },
  searchButtonDisabled: {
    opacity: 0.5,
  },
  searchButtonText: {
    color: '#7c6ff7',
    fontWeight: '700',
    fontSize: 16,
  },
  infoCards: {
    gap: 12,
  },
  infoCard: {
    backgroundColor: '#1e1e2e',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  infoCardEmoji: {
    fontSize: 24,
    marginTop: 2,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  infoCardBody: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
    flex: 1,
  },
});
