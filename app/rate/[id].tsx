import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { submitReview } from '@/lib/plates';
import StarRating from '@/components/StarRating';
import TagSelector from '@/components/TagSelector';

export default function RateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Please select a star rating before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      await submitReview(id, rating, tags, note, isAnonymous);
      Alert.alert('Review submitted!', undefined, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#0f0f1a' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Star rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Rating</Text>
          <Text style={styles.sectionSub}>How was this driver?</Text>
          <View style={styles.starRow}>
            <StarRating rating={rating} onChange={setRating} size={44} />
          </View>
          {rating > 0 && (
            <Text style={styles.ratingLabel}>
              {['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'][rating]}
            </Text>
          )}
        </View>

        {/* Tag selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <Text style={styles.sectionSub}>Select all that apply</Text>
          <TagSelector selected={tags} onChange={setTags} />
        </View>

        {/* Note */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leave a Note</Text>
          <Text style={styles.sectionSub}>
            Optional message for the driver (e.g., "broken tail light")
          </Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Add a note..."
            placeholderTextColor="#555"
            value={note}
            onChangeText={setNote}
            multiline
            maxLength={500}
            numberOfLines={4}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{note.length}/500</Text>
        </View>

        {/* Anonymous toggle */}
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>Post Anonymously</Text>
            <Text style={styles.toggleSub}>Your username won't be shown</Text>
          </View>
          <Switch
            value={isAnonymous}
            onValueChange={setIsAnonymous}
            trackColor={{ false: '#333', true: '#7c6ff7' }}
            thumbColor="#fff"
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitButton, (submitting || rating === 0) && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={submitting || rating === 0}
          activeOpacity={0.85}
        >
          <Text style={styles.submitText}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 48,
    gap: 24,
  },
  section: { gap: 10 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },
  sectionSub: { fontSize: 13, color: '#888' },
  starRow: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  ratingLabel: {
    textAlign: 'center',
    fontSize: 15,
    color: '#7c6ff7',
    fontWeight: '600',
  },
  noteInput: {
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a2a3e',
    minHeight: 100,
  },
  charCount: {
    fontSize: 11,
    color: '#555',
    textAlign: 'right',
    marginTop: -4,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e1e2e',
    borderRadius: 14,
    padding: 16,
  },
  toggleLabel: { fontSize: 15, fontWeight: '600', color: '#fff' },
  toggleSub: { fontSize: 12, color: '#888', marginTop: 2 },
  submitButton: {
    backgroundColor: '#7c6ff7',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 17 },
});
