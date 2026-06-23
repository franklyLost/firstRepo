import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

type Props = {
  rating: number;
  onChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
};

export default function StarRating({ rating, onChange, size = 32, readonly = false }: Props) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => !readonly && onChange?.(star)}
          disabled={readonly}
          activeOpacity={readonly ? 1 : 0.7}
          style={{ marginHorizontal: 2 }}
        >
          <Text style={{ fontSize: size, opacity: star <= rating ? 1 : 0.25 }}>⭐</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
