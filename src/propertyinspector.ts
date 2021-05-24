import { Streamdeck } from '@rweich/streamdeck-ts';
import { is } from 'ts-type-guards';
import { isSettings } from './Settings';

const pi = new Streamdeck().propertyinspector();

function getSelect(id: string): HTMLSelectElement | null {
  const element = document.getElementById(id);
  if (is(HTMLSelectElement)(element)) {
    return element;
  }
  return null;
}

function setSelectValue(id: string, value: string): void {
  const select = getSelect(id);
  if (select) {
    select.value = value;
  }
}

function getSelectValue(id: string): string | null {
  const select = getSelect(id);
  return select ? select.value : null;
}

function onChange(): void {
  if (pi.pluginUUID === undefined) {
    return;
  }
  pi.setSettings(pi.pluginUUID, {
    number: getSelectValue('change_number') || 0,
    background: getSelectValue('change_background') || 'original',
  });
}

pi.on('websocketOpen', (event) => {
  // were there any settings saved?
  pi.getSettings(event.uuid);

  // register event listeners
  Array.from(document.querySelectorAll('.sdpi-item-value')).forEach((element) => {
    if (is(HTMLSelectElement)(element)) {
      element.addEventListener('change', onChange);
    }
  });
});

pi.on('didReceiveSettings', (event) => {
  if (isSettings(event.settings)) {
    setSelectValue('change_number', String(event.settings.number || 0));
    setSelectValue('change_background', event.settings.background || 'original');
  }
});

export default pi;
