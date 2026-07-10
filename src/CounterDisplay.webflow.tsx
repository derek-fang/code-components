import { CounterDisplay } from './CounterDisplay';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(CounterDisplay, {
  name: 'Counter Display',
  description: 'Displays the current value of the shared counter',
  group: 'Shared State Demo',
  props: {
    label: props.Text({
      name: 'Label',
      defaultValue: 'Current count:',
    }),
    variant: props.Variant({
      name: 'Variant',
      options: ['Light', 'Dark'],
      defaultValue: 'Light',
    }),
  },
});
