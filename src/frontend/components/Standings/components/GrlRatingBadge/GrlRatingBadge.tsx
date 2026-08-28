import { useGrlDriverRating, useGrlDriverClass } from '@irdashies/context';

export interface GrlRatingBadgeProps {
  license?: string;
  rating?: number;
  isMinimal?: boolean;
  carIdx?: number;
  name?: string;
  format?:
    | 'license-color-fullrating-combo'
    | 'fullrating-color-no-license'
    | 'license-color-fullrating-bw'
    | 'license-color-rating-bw'
    | 'license-color-rating-bw-no-license'
    | 'rating-color-no-license'
    | 'license-bw-rating-bw'
    | 'rating-only-bw-rating-bw'
    | 'license-bw-rating-bw-no-license'
    | 'rating-bw-no-license'
    | 'fullrating-bw-no-license'
    | 'rating-only-color-rating-bw'
    | 'license-only-color'
    | 'license-only-bw'
    | 'license-only-color-minimal'
    | 'license-only-bw-minimal';
}

/**
 * GrlRatingBadge component
 * Displays GRL-specific ratings and competition classes fetched from grl.taproom.us.
 */
export const GrlRatingBadge = ({
  isMinimal = false,
  format = 'license-color-rating-bw',
  name,
}: GrlRatingBadgeProps) => {
  const grlRating = useGrlDriverRating(name);
  const grlClass = useGrlDriverClass(name);

  // Use real competition class if available, otherwise fall back to Am.
  const grlLicense = grlClass || 'Am';

  const colorMap: Record<string, string> = {
    Pro: 'border-[#6a1b9a] bg-[#4a148c]',
    Am: 'border-[#ffc170] bg-[#ff8f00]',
  };
  //Pro: 'border-[#9c27b0] bg-[#6a1b9a]',
  //Am: 'border-[#ffca28] bg-[#ffc107]',
  const minimalColorMap: Record<string, string> = {
    Pro: 'border-[#4a148c] bg-[#4a148c]',
    Am: 'border-[#ff8f00] bg-[#ff8f00]',
  };
  const color = (isMinimal ? minimalColorMap : colorMap)[grlLicense] ?? '';

  const decimal = String(grlRating / 1000);
  const dotIndex = decimal.indexOf('.') > -1 ? decimal.indexOf('.') : 0;
  const simplifiedRating = Number(decimal.substring(0, dotIndex + 2)).toFixed(
    1
  );

  switch (format) {
    case 'license-only-color':
      return (
        <div className="flex gap-1 items-center justify-center mx-2">
          <div
            className={`text-white text-center text-nowrap border-2 px-1 rounded-md text-xs leading-tight min-w-[3.6em] ${color}`}
          >
            {grlLicense}
          </div>
        </div>
      );

    case 'license-only-bw':
      return (
        <div className="flex gap-1 items-center justify-center mx-2">
          <div className="bg-white/10 text-white text-center border-2 border-transparent px-1 rounded-md text-xs leading-tight min-w-[3.6em]">
            {grlLicense}
          </div>
        </div>
      );

    case 'license-only-color-minimal':
      return (
        <div className="flex gap-1 items-center justify-center mx-2">
          <div
            className={`text-white text-center text-nowrap border-2 px-1 rounded-md text-xs leading-tight min-w-[1.8em] ${color}`}
          >
            {grlLicense.charAt(0)}
          </div>
        </div>
      );

    case 'license-only-bw-minimal':
      return (
        <div className="flex gap-1 items-center justify-center mx-2">
          <div className="bg-white/10 text-white text-center border-2 border-transparent px-1 rounded-md text-xs leading-tight min-w-[1.8em]">
            {grlLicense.charAt(0)}
          </div>
        </div>
      );

    case 'license-color-fullrating-combo':
      return (
        <div className="flex gap-1 items-center justify-center mx-2">
          <div
            className={`flex justify-between items-center text-white text-nowrap border-2 px-1 rounded-md text-xs leading-tight min-w-[6.4em] ${color}`}
          >
            <span>{grlLicense}</span>
            <span>{grlRating}</span>
          </div>
        </div>
      );

    case 'fullrating-color-no-license':
      return (
        <div className="flex gap-1 items-center justify-center mx-2">
          <div
            className={`text-white text-center text-nowrap border-2 px-1 rounded-md text-xs leading-tight min-w-[3.6em] ${color}`}
          >
            {grlRating}
          </div>
        </div>
      );

    case 'license-color-fullrating-bw':
      return (
        <div className="flex gap-1 items-center">
          <div
            className={`text-white text-center text-nowrap border-2 px-1 rounded-md text-xs leading-tight min-w-[3.6em] ${color}`}
          >
            {grlLicense}
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white/10 text-white text-center border-2 border-transparent px-1 rounded-md text-xs leading-tight">
              {grlRating}
            </div>
          </div>
        </div>
      );

    case 'license-color-rating-bw':
      return (
        <div className="flex gap-1 items-center mx-2">
          <div
            className={`text-white text-center text-nowrap border-2 px-1 rounded-md text-xs leading-tight min-w-[3.6em] ${color}`}
          >
            {grlLicense}
          </div>
          <div className="bg-white/10 text-white text-center border-2 border-transparent px-1 rounded-md text-xs leading-tight">
            {simplifiedRating}k
          </div>
        </div>
      );

    case 'rating-only-color-rating-bw':
      return (
        <div className="flex gap-1 items-center mx-2">
          <div
            className={`text-white text-center text-nowrap border-2 px-1 rounded-md text-xs leading-tight min-w-[2.4em] ${color}`}
          >
            {grlLicense}
          </div>
          <div className="bg-white/10 text-white text-center border-2 border-transparent px-1 rounded-md text-xs leading-tight">
            {simplifiedRating}k
          </div>
        </div>
      );

    case 'license-color-rating-bw-no-license':
      return (
        <div className="flex gap-1 items-center mx-2">
          <div
            className={`text-white text-center text-nowrap border-2 px-1 rounded-md text-xs leading-tight min-w-[1.8em] ${color}`}
          >
            {grlLicense.charAt(0)}
          </div>
          <div className="bg-white/10 text-white text-center border-2 border-transparent px-1 rounded-md text-xs leading-tight">
            {simplifiedRating}k
          </div>
        </div>
      );

    case 'rating-color-no-license':
      return (
        <div className="flex gap-1 items-center justify-center mx-2">
          <div
            className={`text-white text-center text-nowrap border-2 px-1 rounded-md text-xs leading-tight ${color}`}
          >
            {simplifiedRating}k
          </div>
        </div>
      );

    case 'license-bw-rating-bw':
      return (
        <div className="flex gap-1 items-center mx-2">
          <div className="bg-white/10 text-white text-center border-2 border-transparent px-1 rounded-md text-xs leading-tight min-w-[3.6em]">
            {grlLicense}
          </div>
          <div className="bg-white/10 text-white text-center border-2 border-transparent px-1 rounded-md text-xs leading-tight">
            {simplifiedRating}k
          </div>
        </div>
      );

    case 'rating-only-bw-rating-bw':
      return (
        <div className="flex gap-1 items-center mx-2">
          <div className="bg-white/10 text-white text-center border-2 border-transparent px-1 rounded-md text-xs leading-tight min-w-[2.4em]">
            {grlLicense.charAt(0)}
          </div>
          <div className="bg-white/10 text-white text-center border-2 border-transparent px-1 rounded-md text-xs leading-tight">
            {simplifiedRating}k
          </div>
        </div>
      );

    case 'license-bw-rating-bw-no-license':
      return (
        <div className="flex gap-1 items-center mx-2">
          <div className="bg-white/10 text-white text-center border-2 border-transparent px-1 rounded-md text-xs leading-tight min-w-[1.8em]">
            {grlLicense.charAt(0)}
          </div>
          <div className="bg-white/10 text-white text-center border-2 border-transparent px-1 rounded-md text-xs leading-tight">
            {simplifiedRating}k
          </div>
        </div>
      );

    case 'rating-bw-no-license':
      return (
        <div className="flex gap-1 items-center justify-center mx-2">
          <div className="text-white text-center text-nowrap border-2 px-1 rounded-md text-xs leading-tight bg-white/10 border-transparent">
            {simplifiedRating}k
          </div>
        </div>
      );

    case 'fullrating-bw-no-license':
      return (
        <div className="flex gap-1 items-center justify-center mx-2">
          <div className="text-white text-center text-nowrap border-2 px-1 rounded-md text-xs leading-tight bg-white/10 border-transparent">
            {grlRating}
          </div>
        </div>
      );

    default:
      return (
        <div className="flex gap-1 items-center mx-2">
          <div
            className={`text-white text-center text-nowrap border-2 px-1 rounded-md text-xs leading-tight min-w-[3.6em] ${color}`}
          >
            {grlLicense}
          </div>
          <div className="bg-white/10 text-white text-center border-2 border-transparent px-1 rounded-md text-xs leading-tight">
            {simplifiedRating}k
          </div>
        </div>
      );
  }
};
