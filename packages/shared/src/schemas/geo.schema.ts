import { z } from 'zod';

export const geocodeSuggestionSchema = z.object({
  placeId: z.string(),
  displayName: z.string(),
  lat: z.number(),
  lng: z.number(),
  city: z.string().optional(),
});
export type GeocodeSuggestion = z.infer<typeof geocodeSuggestionSchema>;
