export const brand = {
  name: 'Wenlas',
  fullName: 'Wenlas Resources Ltd.',
  tagline: 'Good tech. Great everyday.',
  sellerUrl: 'https://jiji.ng/sellerpage-Cya3vFFCDoDTmxwjjm6P39IL',
  address: '8, Idowu Lane, Chelsea Plaza, Computer Village, Ikeja, Lagos',
  hours: 'Monday–Saturday, 9am–6pm',
} as const;

/** Catalogue mode is isolated from the database inherited by the original project. */
export function wenlasCatalogueMode() {
  return process.env.WENLAS_CATALOGUE_MODE !== 'false';
}
