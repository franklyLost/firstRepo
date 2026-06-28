import { supabase } from './supabase';
import { LicensePlate, Review } from '@/types';

export async function findOrCreatePlate(
  plateNumber: string,
  state: string,
): Promise<LicensePlate> {
  const normalized = plateNumber.toUpperCase().replace(/\s/g, '');

  const { data: existing } = await supabase
    .from('license_plates')
    .select('*')
    .eq('plate_number', normalized)
    .eq('state', state)
    .single();

  if (existing) return existing;

  const { data: created, error } = await supabase
    .from('license_plates')
    .insert({ plate_number: normalized, state, country: 'US' })
    .select()
    .single();

  if (error) throw error;
  return created;
}

export async function getPlateWithStats(plateId: string): Promise<LicensePlate | null> {
  const { data } = await supabase
    .from('license_plates')
    .select('*')
    .eq('id', plateId)
    .single();
  return data;
}

export async function getReviewsForPlate(plateId: string): Promise<Review[]> {
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('plate_id', plateId)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function submitReview(
  plateId: string,
  rating: number,
  tags: string[],
  note: string,
  isAnonymous: boolean,
): Promise<Review> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be signed in to submit a review');

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      plate_id: plateId,
      reviewer_id: user.id,
      rating,
      tags,
      note: note.trim() || null,
      is_anonymous: isAnonymous,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function claimPlate(plateId: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be signed in to claim a plate');

  // Check for existing claim by another user (conflict)
  const { data: existingClaim } = await supabase
    .from('plate_claims')
    .select('*')
    .eq('plate_id', plateId)
    .eq('status', 'approved')
    .single();

  const status = existingClaim ? 'conflicted' : 'pending';

  const { error } = await supabase.from('plate_claims').insert({
    plate_id: plateId,
    user_id: user.id,
    status,
  });

  if (error) throw error;
}

export async function getMyClaimedPlates(): Promise<LicensePlate[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('plate_claims')
    .select('license_plates(*)')
    .eq('user_id', user.id)
    .in('status', ['pending', 'approved']);

  return (data?.map((d) => d.license_plates).filter(Boolean) as LicensePlate[]) ?? [];
}

export async function getMyReviews(): Promise<Review[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('reviews')
    .select('*, license_plates(*)')
    .eq('reviewer_id', user.id)
    .order('created_at', { ascending: false });

  return data ?? [];
}
