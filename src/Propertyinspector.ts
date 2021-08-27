import { Settings, isSettings } from './Settings';

import { FormBuilder } from '@rweich/streamdeck-formbuilder';
import { Streamdeck } from '@rweich/streamdeck-ts';

const pi = new Streamdeck().propertyinspector();
let builder: FormBuilder<Settings> | undefined;

pi.on('websocketOpen', ({ uuid }) => pi.getSettings(uuid)); // trigger the didReceiveSettings event

pi.on('didReceiveSettings', ({ settings }) => {
  if (builder === undefined) {
    const initialData: Settings = isSettings(settings) ? settings : { background: 'orange', number: '0' };
    builder = new FormBuilder<Settings>(initialData);
    const numbers = builder.createDropdown().setLabel('Change Value');
    for (const [index] of Array.from({ length: 10 }).entries()) {
      numbers.addOption(String(index), String(index));
    }
    builder.addElement('number', numbers);
    builder.addElement(
      'background',
      builder
        .createDropdown()
        .setLabel('Background')
        .addOption('Orange Background', 'orange')
        .addOption('Red Background', 'red')
        .addOption('Green Background', 'green')
        .addOption('Blue Background', 'blue'),
    );
    builder.appendTo(document.querySelector('.sdpi-wrapper') ?? document.body);
    builder.on('change-settings', () => {
      if (pi.pluginUUID === undefined) {
        console.error('pi has no uuid! is it registered already?', pi.pluginUUID);
        return;
      }
      pi.setSettings(pi.pluginUUID, builder?.getFormData());
    });
  } else if (isSettings(settings)) {
    builder.setFormData(settings);
  }
});

export default pi;
