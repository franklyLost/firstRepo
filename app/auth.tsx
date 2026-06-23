import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function AuthScreen() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signup') {
        if (!username.trim()) {
          Alert.alert('Choose a username');
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username: username.trim() } },
        });
        if (error) throw error;
        Alert.alert('Check your email', 'Confirm your account then sign in.', [
          { text: 'OK', onPress: () => setMode('signin') },
        ]);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.back();
      }
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#0f0f1a' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{mode === 'signin' ? 'Welcome back' : 'Join PlateMatch'}</Text>
        <Text style={styles.subtitle}>
          {mode === 'signin'
            ? 'Sign in to claim plates and manage your reviews.'
            : 'Create an account to claim your plate and see who rated you.'}
        </Text>

        {mode === 'signup' && (
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#555"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#555"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAuth}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          style={styles.toggleRow}
        >
          <Text style={styles.toggleText}>
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <Text style={styles.toggleLink}>
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 28,
    paddingTop: 40,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  button: {
    backgroundColor: '#7c6ff7',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 17 },
  toggleRow: { alignItems: 'center', paddingVertical: 8 },
  toggleText: { fontSize: 14, color: '#666' },
  toggleLink: { color: '#7c6ff7', fontWeight: '600' },
});
