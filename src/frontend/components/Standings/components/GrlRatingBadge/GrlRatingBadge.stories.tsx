import { Meta, StoryObj } from '@storybook/react-vite';
import { GrlRatingBadge } from './GrlRatingBadge';

export default {
  component: GrlRatingBadge,
  title: 'widgets/Standings/components/GrlRatingBadge',
  description:
    'GRL Rating Badge showing Pro/Am status and rating. Currently uses random data.',
} as Meta;

type Story = StoryObj<typeof GrlRatingBadge>;

export const Primary: Story = {
  args: {
    format: 'license-color-rating-bw',
    carIdx: 1,
  },
};

export const AllRatings: Story = {
  args: {
    format: 'license-color-rating-bw',
  },
  render: (args) => (
    <div className="flex flex-col gap-1">
      <GrlRatingBadge {...args} carIdx={1} />
      <GrlRatingBadge {...args} carIdx={2} />
      <GrlRatingBadge {...args} carIdx={3} />
      <GrlRatingBadge {...args} carIdx={4} />
      <GrlRatingBadge {...args} carIdx={5} />
    </div>
  ),
};

export const AllRatingsMinimal: Story = {
  args: {
    format: 'license-color-rating-bw',
    isMinimal: true,
  },
  render: (args) => (
    <div className="flex flex-col gap-1">
      <GrlRatingBadge {...args} carIdx={1} />
      <GrlRatingBadge {...args} carIdx={2} />
      <GrlRatingBadge {...args} carIdx={3} />
      <GrlRatingBadge {...args} carIdx={4} />
      <GrlRatingBadge {...args} carIdx={5} />
    </div>
  ),
};

export const FormatLicenseColorRatingCombined: Story = {
  args: {
    format: 'license-color-fullrating-combo',
    carIdx: 1,
  },
};

export const FormatLicenseColorRatingBw: Story = {
  args: {
    format: 'license-color-rating-bw',
    carIdx: 2,
  },
};

export const FormatLicenseColorRatingBwNoLicense: Story = {
  args: {
    format: 'license-color-rating-bw-no-license',
    carIdx: 3,
  },
};

export const FormatRatingColorNoLicense: Story = {
  args: {
    format: 'rating-color-no-license',
    carIdx: 4,
  },
};

export const FormatFullRatingColorNoLicense: Story = {
  args: {
    format: 'fullrating-color-no-license',
    carIdx: 5,
  },
};

export const FormatLicenseBwRatingBw: Story = {
  args: {
    format: 'license-bw-rating-bw',
    carIdx: 6,
  },
};

export const FormatRatingOnlyBwRatingBw: Story = {
  args: {
    format: 'rating-only-bw-rating-bw',
    carIdx: 7,
  },
};

export const FormatLicenseBwRatingBwNoLicense: Story = {
  args: {
    format: 'license-bw-rating-bw-no-license',
    carIdx: 8,
  },
};

export const FormatRatingBwNoLicense: Story = {
  args: {
    format: 'rating-bw-no-license',
    carIdx: 9,
  },
};

export const FormatFullRatingBwNoLicense: Story = {
  args: {
    format: 'fullrating-bw-no-license',
    carIdx: 10,
  },
};

export const FormatRatingOnlyColorRatingBw: Story = {
  args: {
    format: 'rating-only-color-rating-bw',
    carIdx: 11,
  },
};

export const FormatLicenseColorFullRatingBw: Story = {
  args: {
    format: 'license-color-fullrating-bw',
    carIdx: 12,
  },
};
