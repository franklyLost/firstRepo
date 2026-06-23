import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Review } from '@/types';
import { TAGS } from '@/types';
import StarRating from './StarRating';

type Props = {
  review: Review;
};

export default function ReviewCard({ review }: Props) {
  const tagDetails = TAGS.filter((t) => review.tags.includes(t.id));
  const date = new Date(review.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <StarRating rating={review.rating} size={18} readonly />
        <Text style={styles.date}>{date}</Text>
        {review.is_anonymous && <Text style={styles.anon}>anon</Text>}
      </View>

      {tagDetails.length > 0 && (
        <View style={styles.tags}>
          {tagDetails.map((tag) => (
            <View key={tag.id} style={styles.tag}>
              <Text style={styles.tagEmoji}>{tag.emoji}</Text>
              <Text style={styles.tagLabel}>{tag.label}</Text>
            </View>
          ))}
        </View>
      )}

      {review.note && <Text style={styles.note}>{review.note}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  date: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  anon: {
    fontSize: 10,
    color: '#555',
    backgroundColor: '#252535',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '600',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#252535',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagEmoji: {
    fontSize: 13,
  },
  tagLabel: {
    fontSize: 12,
    color: '#bbb',
  },
  note: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
