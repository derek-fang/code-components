import { TravelCalculator } from './TravelCalculator';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(TravelCalculator, {
  name: 'Travel Calculator',
  description: 'Interactive trip budget estimator with traveler/day steppers and travel style selector',
  group: 'Interactive',
  props: {
    title: props.Text({ name: 'Title', defaultValue: 'Trip Budget Estimator' }),
    currency: props.Variant({
      name: 'Currency',
      options: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
      defaultValue: 'USD',
    }),
    defaultStyle: props.Variant({
      name: 'Default Style',
      options: ['Budget', 'Mid-Range', 'Luxury'],
      defaultValue: 'Mid-Range',
    }),
  },
});
