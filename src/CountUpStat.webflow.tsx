import { CountUpStat } from './CountUpStat';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(CountUpStat, {
  name: 'Count-Up Stat',
  description: 'Animated number that counts from 0 to a target when a button is clicked',
  group: 'Interactive',
  props: {
    targetValue: props.Number({
      name: 'Target Value',
      defaultValue: 10000,
    }),
    duration: props.Number({
      name: 'Duration (ms)',
      defaultValue: 2000,
    }),
    prefix: props.Text({
      name: 'Prefix',
      defaultValue: '',
    }),
    suffix: props.Text({
      name: 'Suffix',
      defaultValue: '',
    }),
    label: props.Text({
      name: 'Label',
      defaultValue: 'satisfied customers',
    }),
    buttonLabel: props.Text({
      name: 'Button Label',
      defaultValue: 'Animate',
    }),
  },
});
