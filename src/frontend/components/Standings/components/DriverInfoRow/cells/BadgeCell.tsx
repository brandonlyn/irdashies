import { memo } from 'react';
import {
  DriverRatingBadge,
  type DriverRatingBadgeProps,
} from '../../DriverRatingBadge/DriverRatingBadge';
import { GrlRatingBadge } from '../../GrlRatingBadge/GrlRatingBadge';

interface BadgeCellProps {
  license?: string;
  rating?: number;
  badgeFormat?: DriverRatingBadgeProps['format'];
  isMinimal?: boolean;
  compactMode?: string;
  type?: 'driver' | 'grl';
  carIdx?: number;
  name?: string;
}

export const BadgeCell = memo(
  ({
    license,
    rating,
    badgeFormat,
    isMinimal,
    compactMode,
    type = 'driver',
    carIdx,
    name,
  }: BadgeCellProps) => {
    const pxClass =
      compactMode === 'ultra'
        ? ''
        : compactMode === 'compact'
          ? 'px-1'
          : 'px-2';
    return (
      <td
        data-column={type === 'grl' ? 'grlBadge' : 'badge'}
        className={`w-auto whitespace-nowrap text-center ${pxClass}`}
      >
        {type === 'grl' ? (
          <GrlRatingBadge
            license={license}
            rating={rating}
            format={badgeFormat}
            isMinimal={isMinimal}
            carIdx={carIdx}
            name={name}
          />
        ) : (
          <DriverRatingBadge
            license={license}
            rating={rating}
            format={badgeFormat}
            isMinimal={isMinimal}
          />
        )}
      </td>
    );
  }
);

BadgeCell.displayName = 'BadgeCell';
