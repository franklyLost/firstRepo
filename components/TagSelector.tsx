import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { TAGS, Tag } from '@/types';

type Props = {
  selected: string[];
  onChange: (tags: string[]) => void;
};

export default function TagSelector({ selected, onChange }: Props) {
  const toggle = (tagId: string) => {
    onChange(
      selected.includes(tagId)
        ? selected.filter((t) => t !== tagId)
        : [...selected, tagId],
    );
  };

  const positive = TAGS.filter((t) => t.sentiment === 'positive');
  const negative = TAGS.filter((t) => t.sentiment === 'negative');
  const neutral = TAGS.filter((t) => t.sentiment === 'neutral');

  return (
    <View>
      <TagGroup label="Positive" tags={positive} selected={selected} onToggle={toggle} />
      <TagGroup label="Negative" tags={negative} selected={selected} onToggle={toggle} />
      <TagGroup label="Informational" tags={neutral} selected={selected} onToggle={toggle} />
    </View>
  );
}

function TagGroup({
  label,
  tags,
  selected,
  onToggle,
}: {
  label: string;
  tags: Tag[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      <View style={styles.wrap}>
        {tags.map((tag) => {
          const isSelected = selected.includes(tag.id);
          return (
            <TouchableOpacity
              key={tag.id}
              onPress={() => onToggle(tag.id)}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
                tag.sentiment === 'positive' && isSelected && styles.chipPositive,
                tag.sentiment === 'negative' && isSelected && styles.chipNegative,
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.chipEmoji}>{tag.emoji}</Text>
              <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>
                {tag.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 16,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e1e2e',
    borderWidth: 1.5,
    borderColor: '#333',
  },
  chipSelected: {
    borderColor: '#666',
  },
  chipPositive: {
    backgroundColor: '#1a2e1a',
    borderColor: '#4caf50',
  },
  chipNegative: {
    backgroundColor: '#2e1a1a',
    borderColor: '#f44336',
  },
  chipEmoji: {
    fontSize: 16,
  },
  chipLabel: {
    fontSize: 13,
    color: '#aaa',
    fontWeight: '500',
  },
  chipLabelSelected: {
    color: '#fff',
  },
});
