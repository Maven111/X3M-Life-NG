export interface CharacterOption<T extends string = string> {
  readonly value: T;
  readonly label: string;
}

export const GENDER_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non_binary', label: 'Non-Binary' },
  { value: 'unspecified', label: 'Prefer not to say' }
] as const;

export const OUTFIT_OPTIONS = [
  { value: 'business_casual', label: 'Agency Smart Casual' },
  { value: 'creative_street', label: 'Lagos Creative Chic' },
  { value: 'pitch_formal', label: 'Client Pitch Formal' }
] as const;

export const SKIN_TONE_OPTIONS = [
  { value: 'deep', label: 'Deep' },
  { value: 'rich_brown', label: 'Rich Brown' },
  { value: 'warm_caramel', label: 'Warm Caramel' },
  { value: 'light', label: 'Light' },
  { value: 'default', label: 'Default' }
] as const;

export const HAIRSTYLE_OPTIONS = [
  { value: 'default', label: 'Classic Cut' },
  { value: 'braids', label: 'Braids' },
  { value: 'locs', label: 'Locs' },
  { value: 'low_fade', label: 'Low Fade' },
  { value: 'natural_afro', label: 'Natural Afro' }
] as const;

export const GENDER_VALUES = ['female', 'male', 'non_binary', 'unspecified'] as const;
export const OUTFIT_VALUES = ['business_casual', 'creative_street', 'pitch_formal'] as const;
export const SKIN_TONE_VALUES = ['deep', 'rich_brown', 'warm_caramel', 'light', 'default'] as const;
export const HAIRSTYLE_VALUES = ['default', 'braids', 'locs', 'low_fade', 'natural_afro'] as const;
export const ENTRY_BUSINESS_UNIT_CODES = ['BU1', 'BU2', 'BU3'] as const;

export type GenderPresentationValue = (typeof GENDER_VALUES)[number];
export type OutfitKeyValue = (typeof OUTFIT_VALUES)[number];
export type SkinToneValue = (typeof SKIN_TONE_VALUES)[number];
export type HairstyleValue = (typeof HAIRSTYLE_VALUES)[number];
export type EntryBusinessUnitCode = (typeof ENTRY_BUSINESS_UNIT_CODES)[number];

export const DEFAULT_CHARACTER_APPEARANCE = {
  genderPresentation: 'unspecified' as GenderPresentationValue,
  skinTone: 'default' as SkinToneValue,
  hairstyle: 'default' as HairstyleValue,
  outfitKey: 'business_casual' as OutfitKeyValue,
  organisationUnitCode: 'BU1' as EntryBusinessUnitCode
};

