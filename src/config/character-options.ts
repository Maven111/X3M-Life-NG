export interface CharacterOption<T extends string = string> {
  readonly value: T;
  readonly label: string;
}

export interface ColorSwatchOption<T extends string = string> extends CharacterOption<T> {
  readonly hex: string;
  readonly accentHex?: string;
}

export interface OutfitOption<T extends string = string> extends CharacterOption<T> {
  readonly maleDesc: string;
  readonly femaleDesc: string;
}

export const GENDER_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' }
] as const;

export const SKIN_TONE_OPTIONS = [
  { value: 'deep_espresso', label: 'Deep Espresso', hex: '#3B2314' },
  { value: 'rich_ebony', label: 'Rich Ebony', hex: '#54321D' },
  { value: 'warm_mahogany', label: 'Warm Mahogany', hex: '#73452A' },
  { value: 'golden_chestnut', label: 'Golden Chestnut', hex: '#945D3A' },
  { value: 'caramel_bronze', label: 'Caramel Bronze', hex: '#B97E52' },
  { value: 'light_sand', label: 'Light Sand', hex: '#DCA882' }
] as const satisfies readonly ColorSwatchOption[];

export const MALE_HAIRSTYLE_OPTIONS = [
  { value: 'low_fade', label: 'Low Skin Fade' },
  { value: 'sponge_twists', label: 'Sponge Twists' },
  { value: 'neat_locs', label: 'Neat Locs' },
  { value: 'classic_waves', label: 'Classic Waves' },
  { value: 'short_afro', label: 'Short Tapered Afro' },
  { value: 'clean_buzz', label: 'Clean Buzz Cut' }
] as const;

export const FEMALE_HAIRSTYLE_OPTIONS = [
  { value: 'knotless_braids', label: 'Knotless Braids' },
  { value: 'butterfly_locs', label: 'Butterfly Locs' },
  { value: 'afro_puff', label: 'Natural Afro Puff' },
  { value: 'sleek_bob', label: 'Sleek Bob' },
  { value: 'cornrows', label: 'Stitch Cornrows' },
  { value: 'high_ponytail', label: 'High Ponytail' }
] as const;

export const HAIRSTYLE_OPTIONS_BY_GENDER = {
  male: MALE_HAIRSTYLE_OPTIONS,
  female: FEMALE_HAIRSTYLE_OPTIONS
} as const;

export const OUTFIT_OPTIONS = [
  {
    value: 'y2k',
    label: 'Y2K',
    maleDesc: 'Oversized retro jersey, relaxed cargo trousers & street sneakers',
    femaleDesc: 'Cropped Y2K statement top, pleated/cargo bottom & chunky kicks'
  },
  {
    value: 'smart_casual',
    label: 'Smart Casual',
    maleDesc: 'Tailored open-collar blazer over crisp tee & tapered chinos',
    femaleDesc: 'Chic agency blazer over structured top & tailored trousers'
  },
  {
    value: 'corporate',
    label: 'Corporate Wear',
    maleDesc: 'Sharp Lagos pitch suit, crisp shirt & power tie',
    femaleDesc: 'Structured executive blazer, tailored pencil silhouette & heels'
  },
  {
    value: 'casual',
    label: 'Casual',
    maleDesc: 'Relaxed creative studio tee, layered overshirt & clean denim',
    femaleDesc: 'Relaxed creative studio knit top & effortless Lagos denim'
  }
] as const satisfies readonly OutfitOption[];

export const OUTFIT_COLOR_OPTIONS = [
  { value: 'x3m_crimson', label: 'X3M Crimson', hex: '#D32F2F', accentHex: '#F9A825' },
  { value: 'charcoal_black', label: 'Charcoal', hex: '#1F2937', accentHex: '#E5E7EB' },
  { value: 'royal_navy', label: 'Royal Navy', hex: '#1D3557', accentHex: '#93C5FD' },
  { value: 'lagos_emerald', label: 'Lagos Emerald', hex: '#0F766E', accentHex: '#FDE047' },
  { value: 'sunset_amber', label: 'Sunset Amber', hex: '#D97706', accentHex: '#FEF3C7' },
  { value: 'crisp_ivory', label: 'Crisp Ivory', hex: '#E5E7EB', accentHex: '#1F2937' },
  { value: 'deep_plum', label: 'Deep Plum', hex: '#6D28D9', accentHex: '#F5D0FE' },
  { value: 'olive_street', label: 'Olive Street', hex: '#4D6B3C', accentHex: '#FEF08A' }
] as const satisfies readonly ColorSwatchOption[];

export const ACCESSORY_OPTIONS = [
  { value: 'glasses', label: 'Glasses' },
  { value: 'cap', label: 'Cap' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'neck_chain', label: 'Neck Chain' }
] as const;

export const GENDER_VALUES = ['female', 'male'] as const;
export const SKIN_TONE_VALUES = [
  'deep_espresso',
  'rich_ebony',
  'warm_mahogany',
  'golden_chestnut',
  'caramel_bronze',
  'light_sand'
] as const;
export const HAIRSTYLE_VALUES = [
  'low_fade',
  'sponge_twists',
  'neat_locs',
  'classic_waves',
  'short_afro',
  'clean_buzz',
  'knotless_braids',
  'butterfly_locs',
  'afro_puff',
  'sleek_bob',
  'cornrows',
  'high_ponytail'
] as const;
export const OUTFIT_VALUES = ['y2k', 'smart_casual', 'corporate', 'casual'] as const;
export const OUTFIT_COLOR_VALUES = [
  'x3m_crimson',
  'charcoal_black',
  'royal_navy',
  'lagos_emerald',
  'sunset_amber',
  'crisp_ivory',
  'deep_plum',
  'olive_street'
] as const;
export const ACCESSORY_VALUES = ['glasses', 'cap', 'earrings', 'neck_chain'] as const;
export const ENTRY_BUSINESS_UNIT_CODES = ['BU1', 'BU2', 'BU3'] as const;

export type GenderPresentationValue = (typeof GENDER_VALUES)[number];
export type SkinToneValue = (typeof SKIN_TONE_VALUES)[number];
export type HairstyleValue = (typeof HAIRSTYLE_VALUES)[number];
export type OutfitKeyValue = (typeof OUTFIT_VALUES)[number];
export type OutfitColorValue = (typeof OUTFIT_COLOR_VALUES)[number];
export type AccessoryValue = (typeof ACCESSORY_VALUES)[number];
export type EntryBusinessUnitCode = (typeof ENTRY_BUSINESS_UNIT_CODES)[number];

export const DEFAULT_CHARACTER_APPEARANCE = {
  genderPresentation: 'female' as GenderPresentationValue,
  skinTone: 'warm_mahogany' as SkinToneValue,
  hairstyle: 'knotless_braids' as HairstyleValue,
  outfitKey: 'smart_casual' as OutfitKeyValue,
  outfitColor: 'x3m_crimson' as OutfitColorValue,
  accessories: ['glasses', 'neck_chain'] as AccessoryValue[],
  organisationUnitCode: 'BU1' as EntryBusinessUnitCode
};

export function getSkinToneHex(value: string): string {
  return SKIN_TONE_OPTIONS.find((s) => s.value === value)?.hex ?? '#73452A';
}

export function getOutfitColorSwatch(value: string): { hex: string; accentHex: string } {
  const found = OUTFIT_COLOR_OPTIONS.find((c) => c.value === value);
  return {
    hex: found?.hex ?? '#D32F2F',
    accentHex: found?.accentHex ?? '#F9A825'
  };
}
