import { FlightCarbonMap } from './FlightCarbonMap';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(FlightCarbonMap, {
  name: 'Flight Carbon Map',
  description: 'Interactive world map that estimates CO₂ emissions and offset cost for flights between major airports',
  group: 'Travel',
  props: {
    title: props.Text({
      name: 'Title',
      defaultValue: 'Your Flight\'s Carbon Impact',
    }),
    subtitle: props.Text({
      name: 'Subtitle',
      defaultValue: 'Select your departure and arrival airports to see the estimated CO₂ emissions for your journey.',
    }),
    defaultOrigin: props.Variant({
      name: 'Default Origin',
      options: ['JFK', 'LAX', 'LHR', 'CDG', 'FRA', 'AMS', 'DXB', 'SIN', 'NRT', 'SYD'],
      defaultValue: 'JFK',
    }),
    defaultDestination: props.Variant({
      name: 'Default Destination',
      options: ['JFK', 'LAX', 'LHR', 'CDG', 'FRA', 'AMS', 'DXB', 'SIN', 'NRT', 'SYD'],
      defaultValue: 'LHR',
    }),
  },
});
