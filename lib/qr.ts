// Shared encode/decode format for driver QR codes, so the generator
// (driver side) and the camera scanner (passenger side) agree on what
// counts as a valid OWA driver code rather than any arbitrary QR/barcode.
const PREFIX = "owa-driver:";

export const encodeDriverQr = (tag: string) => `${PREFIX}${tag}`;

export const decodeDriverQr = (text: string): string | null => {
  if (!text.startsWith(PREFIX)) return null;
  const tag = text.slice(PREFIX.length).trim();
  return tag.length > 0 ? tag : null;
};
