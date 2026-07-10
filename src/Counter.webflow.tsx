import { Counter } from './Counter';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Counter, {
  name: 'Counter',
  description: 'Increments a shared counter consumed by other components on the page',
  group: 'Shared State Demo',
  props: {
    label: props.Text({
      name: 'Label',
      defaultValue: 'Counter',
    }),
    step: props.Number({
      name: 'Step',
      defaultValue: 1,
    }),
  },
});
