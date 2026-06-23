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
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { getMyClaimedPlates, getMyReviews } from '@/lib/plates';
import { LicensePlate, Review } from '@/types';
import PlateCard from '@/components/PlateCard';
import ReviewCard from '@/components/ReviewCard';

export default function ProfileScreen() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [claimedPlates, setClaimedPlates] = useState<LicensePlate[]>([]);
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<'plates' | 'reviews'>('plates');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const load = async () => {
    const [plates, reviews] = await Promise.all([getMyClaimedPlates(), getMyReviews()]);
    setClaimedPlates(plates);
    setMyReviews(reviews);
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setClaimedPlates([]);
    setMyReviews([]);
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.guestEmoji}>🔐</Text>
        <Text style={styles.guestTitle}>Sign in to manage your plates</Text>
        <Text style={styles.guestSub}>
          Create an account to claim your plate and see reviews left for you.
        </Text>
        <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/auth')}>
          <Text style={styles.signInButtonText}>Sign In / Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c6ff7" />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{user.email?.[0]?.toUpperCase() ?? '?'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.stats}>
            {claimedPlates.length} claimed • {myReviews.length} reviews given
          </Text>
        </View>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.signOut}>Sign out</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'plates' && styles.tabActive]}
          onPress={() => setTab('plates')}
        >
          <Text style={[styles.tabText, tab === 'plates' && styles.tabTextActive]}>
            My Plates
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'reviews' && styles.tabActive]}
          onPress={() => setTab('reviews')}
        >
          <Text style={[styles.tabText, tab === 'reviews' && styles.tabTextActive]}>
            Reviews Given
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {tab === 'plates' && (
          <>
            {claimedPlates.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyEmoji}>🚗</Text>
                <Text style={styles.emptyTitle}>No plates claimed yet</Text>
                <Text style={styles.emptySub}>
                  Search for your plate and tap "Claim This Plate" to see reviews left for
                  you.
                </Text>
              </View>
            ) : (
              claimedPlates.map((plate) => (
                <PlateCard
                  key={plate.id}
                  plate={plate}
                  onPress={() => router.push(`/plate/${plate.id}`)}
                />
              ))
            )}
          </>
        )}

        {tab === 'reviews' && (
          <>
            {myReviews.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyEmoji}>⭐</Text>
                <Text style={styles.emptyTitle}>No reviews yet</Text>
                <Text style={styles.emptySub}>
                  Scan a plate and leave your first rating.
                </Text>
              </View>
            ) : (
              myReviews.map((review) => <ReviewCard key={review.id} review={review} />)
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
    backgroundColor: '#0f0f1a',
  },
  guestEmoji: { fontSize: 48 },
  guestTitle: { fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center' },
  guestSub: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20 },
  signInButton: {
    backgroundColor: '#7c6ff7',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  signInButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e2e',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#7c6ff7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#fff' },
  email: { fontSize: 14, color: '#ccc', fontWeight: '600' },
  stats: { fontSize: 12, color: '#666', marginTop: 2 },
  signOut: { fontSize: 13, color: '#666' },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e2e',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#7c6ff7',
  },
  tabText: { fontSize: 14, color: '#666', fontWeight: '600' },
  tabTextActive: { color: '#7c6ff7' },
  content: { padding: 20, gap: 14 },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  emptySub: { fontSize: 13, color: '#888', textAlign: 'center', lineHeight: 18, maxWidth: 240 },
});
