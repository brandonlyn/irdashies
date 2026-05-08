// Badge preview component to show different formats
export const BadgeFormatPreview = ({
  format,
  selected,
  onClick,
  type = 'driver',
}: {
  format: string;
  selected: boolean;
  onClick: () => void;
  type?: 'driver' | 'grl';
}) => {
  const isGrl = type === 'grl';

  // Actual GrlRatingBadge uses Pro for > 3000 rating, let's use Pro for preview
  const grlLicense = 'Pro';
  const grlColor = 'border-[#9c27b0] bg-[#6a1b9a]';
  const iracingColor = 'border-green-500 bg-green-800';

  const badgeColor = isGrl ? grlColor : iracingColor;
  const licenseText = isGrl ? grlLicense : 'B 3.8';
  const shortLicenseText = isGrl ? 'P' : 'B';
  const ratingText = isGrl ? '3412' : '1412';
  const kRatingText = isGrl ? '3.4k' : '1.4k';

  const renderPreview = () => {
    switch (format) {
      case 'license-only-color':
        return (
          <div
            className={`text-white text-nowrap border-2 px-1 rounded-md text-xs leading-tight min-w-[3.6em] text-center ${badgeColor}`}
          >
            {licenseText}
          </div>
        );
      case 'license-only-bw':
        return (
          <div className="bg-white/10 text-white text-center text-nowrap border-2 border-transparent px-1 rounded-md text-xs leading-tight min-w-[3.6em]">
            {licenseText}
          </div>
        );
      case 'license-only-color-minimal':
        return (
          <div
            className={`text-white text-nowrap border-2 px-1 rounded-md text-xs leading-tight min-w-[1.8em] text-center ${badgeColor}`}
          >
            {shortLicenseText}
          </div>
        );
      case 'license-only-bw-minimal':
        return (
          <div className="bg-white/10 text-white text-center text-nowrap border-2 border-transparent px-1 rounded-md text-xs leading-tight min-w-[1.8em]">
            {shortLicenseText}
          </div>
        );
      case 'license-color-fullrating-combo':
        return (
          <div
            className={`text-white text-nowrap border-2 px-1 rounded-md text-xs leading-tight ${badgeColor}`}
          >
            {licenseText} &nbsp; {ratingText}
          </div>
        );
      case 'fullrating-color-no-license':
        return (
          <div
            className={`text-white text-nowrap border-2 px-1 rounded-md text-xs leading-tight ${badgeColor}`}
          >
            {ratingText}
          </div>
        );
      case 'license-color-fullrating-bw':
        return (
          <div className="flex gap-1 items-center">
            <div
              className={`text-white text-nowrap border-2 px-1 rounded-md text-xs leading-tight ${badgeColor}`}
            >
              {licenseText}
            </div>
            <div className="bg-white/10 text-white border-2 border-transparent px-1 rounded-md text-xs leading-tight">
              {ratingText}
            </div>
          </div>
        );
      case 'license-color-rating-bw':
        return (
          <div className="flex gap-1 items-center">
            <div
              className={`text-white text-nowrap border-2 px-1 rounded-md text-xs leading-tight ${badgeColor}`}
            >
              {licenseText}
            </div>
            <div className="bg-white/10 text-white border-2 border-transparent px-1 rounded-md text-xs leading-tight">
              {kRatingText}
            </div>
          </div>
        );
      case 'rating-only-color-rating-bw':
        return (
          <div className="flex gap-1 items-center">
            <div
              className={`text-white text-nowrap border-2 px-1 rounded-md text-xs leading-tight ${badgeColor}`}
            >
              {isGrl ? licenseText : '3.8'}
            </div>
            <div className="bg-white/10 text-white border-2 border-transparent px-1 rounded-md text-xs leading-tight">
              {kRatingText}
            </div>
          </div>
        );
      case 'license-color-rating-bw-no-license':
        return (
          <div className="flex gap-1 items-center">
            <div
              className={`text-white text-nowrap border-2 px-1 rounded-md text-xs leading-tight ${badgeColor}`}
            >
              {shortLicenseText}
            </div>
            <div className="bg-white/10 text-white border-2 border-transparent px-1 rounded-md text-xs leading-tight">
              {kRatingText}
            </div>
          </div>
        );
      case 'rating-color-no-license':
        return (
          <div
            className={`text-white text-nowrap border-2 px-1 rounded-md text-xs leading-tight ${badgeColor}`}
          >
            {kRatingText}
          </div>
        );
      case 'license-bw-rating-bw':
        return (
          <div className="flex gap-1 items-center">
            <div className="bg-white/10 text-white border-2 border-transparent px-1 rounded-md text-xs leading-tight">
              {licenseText}
            </div>
            <div className="bg-white/10 text-white border-2 border-transparent px-1 rounded-md text-xs leading-tight">
              {kRatingText}
            </div>
          </div>
        );
      case 'rating-only-bw-rating-bw':
        return (
          <div className="flex gap-1 items-center">
            <div className="bg-white/10 text-white border-2 border-transparent px-1 rounded-md text-xs leading-tight">
              {isGrl ? shortLicenseText : '3.8'}
            </div>
            <div className="bg-white/10 text-white border-2 border-transparent px-1 rounded-md text-xs leading-tight">
              {kRatingText}
            </div>
          </div>
        );
      case 'license-bw-rating-bw-no-license':
        return (
          <div className="flex gap-1 items-center">
            <div className="bg-white/10 text-white border-2 border-transparent px-1 rounded-md text-xs leading-tight">
              {shortLicenseText}
            </div>
            <div className="bg-white/10 text-white border-2 border-transparent px-1 rounded-md text-xs leading-tight">
              {kRatingText}
            </div>
          </div>
        );
      case 'rating-bw-no-license':
        return (
          <div className="text-white text-nowrap border-2 px-1 rounded-md text-xs leading-tight bg-white/10 border-transparent">
            {kRatingText}
          </div>
        );
      case 'fullrating-bw-no-license':
        return (
          <div className="text-white text-nowrap border-2 px-1 rounded-md text-xs leading-tight bg-white/10 border-transparent">
            {ratingText}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded border cursor-pointer transition-colors inline-flex items-center justify-center ${
        selected
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-transparent hover:bg-slate-800'
      }`}
    >
      {renderPreview()}
    </button>
  );
};
