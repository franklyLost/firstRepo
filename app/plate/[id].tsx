import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LicensePlate, Review } from '@/types';
import { getPlateWithStats, getReviewsForPlate } from '@/lib/plates';
import { supabase } from '@/lib/supabase';
import PlateCard from '@/components/PlateCard';
import ReviewCard from '@/components/ReviewCard';
import { US_STATES } from '@/lib/plateRecognizer';

export default function PlateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [plate, setPlate] = useState<LicensePlate | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const load = async () => {
    const [p, r, { data: { user } }] = await Promise.all([
      getPlateWithStats(id),
      getReviewsForPlate(id),
      supabase.auth.getUser(),
    ]);
    setPlate(p);
    setReviews(r);
    setIsSignedIn(!!user);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!plate) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Plate not found</Text>
      </View>
    );
  }

  const stateName = US_STATES[plate.state] ?? plate.state;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c6ff7" />}
    >
      <PlateCard plate={plate} />

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            if (!isSignedIn) {
              Alert.alert('Sign In Required', 'You need an account to rate drivers.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign In', onPress: () => router.push('/auth') },
              ]);
              return;
            }
            router.push(`/rate/${id}`);
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>⭐ Rate This Driver</Text>
        </TouchableOpacity>

        {!plate.claimed_by && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              if (!isSignedIn) {
                Alert.alert('Sign In Required', 'You need an account to claim a plate.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Sign In', onPress: () => router.push('/auth') },
                ]);
                return;
              }
              router.push(`/claim/${id}`);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>🔒 Claim This Plate</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Reviews */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Reviews ({reviews.length})
        </Text>
        {reviews.length === 0 ? (
          <View style={styles.noReviews}>
            <Text style={styles.noReviewsEmoji}>💬</Text>
            <Text style={styles.noReviewsText}>No reviews yet. Be the first!</Text>
          </View>
        ) : (
          reviews.map((review) => <ReviewCard key={review.id} review={review} />)
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: { padding: 20, gap: 20, paddingBottom: 48 },
  centered: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { color: '#888', fontSize: 16 },
  errorText: { color: '#f44', fontSize: 16 },
  actions: { gap: 10 },
  primaryButton: {
    backgroundColor: '#7c6ff7',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondaryButton: {
    backgroundColor: '#1e1e2e',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  secondaryButtonText: { color: '#ccc', fontWeight: '600', fontSize: 16 },
  section: { gap: 14 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  noReviews: {
    backgroundColor: '#1e1e2e',
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  noReviewsEmoji: { fontSize: 32 },
  noReviewsText: { color: '#888', fontSize: 14 },
});
