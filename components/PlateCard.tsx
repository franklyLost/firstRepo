import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LicensePlate } from '@/types';
import { US_STATES } from '@/lib/plateRecognizer';
import StarRating from './StarRating';

type Props = {
  plate: LicensePlate;
  onPress?: () => void;
};

export default function PlateCard({ plate, onPress }: Props) {
  const stateName = US_STATES[plate.state] ?? plate.state;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.75 : 1}
      style={styles.card}
    >
      <View style={styles.plateDisplay}>
        <Text style={styles.stateLabel}>{stateName}</Text>
        <Text style={styles.plateNumber}>{plate.plate_number}</Text>
        {plate.claimed_by && (
          <View style={styles.claimedBadge}>
            <Text style={styles.claimedText}>
              {plate.claim_verified ? '✅ Verified Owner' : '🔒 Claimed'}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.stats}>
        <StarRating rating={Math.round(plate.avg_rating)} size={20} readonly />
        <Text style={styles.ratingText}>
          {plate.avg_rating > 0 ? plate.avg_rating.toFixed(1) : '—'}
        </Text>
        <Text style={styles.reviewCount}>
          {plate.review_count} {plate.review_count === 1 ? 'review' : 'reviews'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1e2e',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
    gap: 16,
  },
  plateDisplay: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 3,
    borderColor: '#222',
    gap: 2,
  },
  stateLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  plateNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111',
    letterSpacing: 4,
    fontFamily: 'monospace',
  },
  claimedBadge: {
    marginTop: 4,
  },
  claimedText: {
    fontSize: 11,
    color: '#555',
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  reviewCount: {
    fontSize: 13,
    color: '#888',
    marginLeft: 4,
  },
});
