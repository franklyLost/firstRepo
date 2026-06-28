import { PlateRecognizerResult } from '@/types';

const API_TOKEN = process.env.EXPO_PUBLIC_PLATE_RECOGNIZER_TOKEN ?? '';
const API_URL = 'https://api.platerecognizer.com/v1/plate-reader/';

// US state abbreviation lookup used for display
export const US_STATES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina',
  ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
  TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming', DC: 'Washington D.C.',
};

export async function recognizePlate(imageUri: string): Promise<PlateRecognizerResult> {
  const formData = new FormData();
  formData.append('upload', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'plate.jpg',
  } as unknown as Blob);
  formData.append('regions', 'us');

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Token ${API_TOKEN}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Plate recognition failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('No license plate detected in image');
  }

  const best = data.results[0];
  const region = best.region?.code?.toUpperCase() ?? '';
  // PlateRecognizer returns region codes like "us-ca" — extract state
  const state = region.startsWith('US-') ? region.slice(3) : region;

  return {
    plate: best.plate.toUpperCase(),
    state,
    confidence: best.score,
    candidates: best.candidates?.map((c: { plate: string; score: number }) => ({
      plate: c.plate.toUpperCase(),
      confidence: c.score,
    })) ?? [],
  };
}

// For development/demo without a real API key
export function mockRecognizePlate(): Promise<PlateRecognizerResult> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          plate: '7ABC123',
          state: 'CA',
          confidence: 0.92,
          candidates: [
            { plate: '7ABC123', confidence: 0.92 },
            { plate: '7ABC128', confidence: 0.04 },
          ],
        }),
      1500,
    ),
  );
}
