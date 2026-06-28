export type Tag = {
  id: string;
  emoji: string;
  label: string;
  sentiment: 'positive' | 'negative' | 'neutral';
};

export const TAGS: Tag[] = [
  { id: 'good_driver', emoji: '🟢', label: 'Good Driver', sentiment: 'positive' },
  { id: 'courteous', emoji: '👍', label: 'Courteous', sentiment: 'positive' },
  { id: 'safe', emoji: '🦺', label: 'Safe Driver', sentiment: 'positive' },
  { id: 'polite', emoji: '🙏', label: 'Polite', sentiment: 'positive' },
  { id: 'speeder', emoji: '💨', label: 'Speeder', sentiment: 'negative' },
  { id: 'ran_red', emoji: '🛑', label: 'Ran Red Light', sentiment: 'negative' },
  { id: 'on_phone', emoji: '📱', label: 'On Phone', sentiment: 'negative' },
  { id: 'cut_off', emoji: '✂️', label: 'Cut Me Off', sentiment: 'negative' },
  { id: 'road_rage', emoji: '🚨', label: 'Road Rage', sentiment: 'negative' },
  { id: 'tailgating', emoji: '🚗', label: 'Tailgating', sentiment: 'negative' },
  { id: 'bad_parking', emoji: '🅿️', label: 'Bad Parking', sentiment: 'negative' },
  { id: 'dangerous', emoji: '⚠️', label: 'Dangerous', sentiment: 'negative' },
  { id: 'broken_light', emoji: '💡', label: 'Broken Light', sentiment: 'neutral' },
  { id: 'loud_music', emoji: '🎵', label: 'Loud Music', sentiment: 'neutral' },
];

export type LicensePlate = {
  id: string;
  plate_number: string;
  state: string;
  country: string;
  claimed_by?: string;
  claim_verified: boolean;
  avg_rating: number;
  review_count: number;
  created_at: string;
};

export type Review = {
  id: string;
  plate_id: string;
  reviewer_id: string;
  rating: number;
  tags: string[];
  note?: string;
  is_anonymous: boolean;
  created_at: string;
  plate?: LicensePlate;
};

export type Profile = {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
};

export type PlateClaim = {
  id: string;
  plate_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'conflicted';
  created_at: string;
};

export type PlateRecognizerResult = {
  plate: string;
  state: string;
  confidence: number;
  candidates: Array<{ plate: string; confidence: number }>;
};
