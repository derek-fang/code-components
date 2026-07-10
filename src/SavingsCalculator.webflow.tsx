import { SavingsCalculator } from './SavingsCalculator';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(SavingsCalculator, {
  name: 'Savings Calculator',
  description:
    'Interactive calculator showing how much travelers save per year with TripFold — trips stepper, spend slider, and Free/Pro plan toggle',
  group: 'Interactive',
  props: {
    title: props.Text({
      name: 'Title',
      defaultValue: 'See how much you’d save',
    }),
    subtitle: props.Text({
      name: 'Subtitle',
      defaultValue:
        'Estimate your yearly savings when you book your trips with TripFold.',
    }),
    currency: props.Variant({
      name: 'Currency',
      options: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
      defaultValue: 'USD',
    }),
    defaultTrips: props.Number({
      name: 'Default Trips / Year',
      defaultValue: 3,
    }),
    defaultSpend: props.Number({
      name: 'Default Spend / Trip',
      defaultValue: 2500,
    }),
    defaultPlan: props.Variant({
      name: 'Default Plan',
      options: ['Free', 'Pro'],
      defaultValue: 'Pro',
    }),
  },
});
