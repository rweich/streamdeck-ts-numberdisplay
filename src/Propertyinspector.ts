import { Streamdeck } from '@rweich/streamdeck-ts';
import { is } from 'ts-type-guards';
import { isSettings } from './Settings';

const pi = new Streamdeck().propertyinspector();

function getSelect(id: string): HTMLSelectElement | undefined {
  const element = document.querySelector(`#${id}`);
  if (is(HTMLSelectElement)(element)) {
    return element;
  }
  return;
}

function setSelectValue(id: string, value: string): void {
  const select = getSelect(id);
  if (select) {
    select.value = value;
  }
}

function getSelectValue(id: string): string | undefined {
  return getSelect(id)?.value;
}

function onChange(): void {
  if (pi.pluginUUID === undefined) {
    return;
  }
  pi.setSettings(pi.pluginUUID, {
    background: getSelectValue('change_background') || 'original',
    number: getSelectValue('change_number') || 0,
  });
}

pi.on('websocketOpen', (event) => {
  // were there any settings saved?
  pi.getSettings(event.uuid);

  // register event listeners
  for (const element of Array.from(document.querySelectorAll('.sdpi-item-value'))) {
    if (is(HTMLSelectElement)(element)) {
      element.addEventListener('change', onChange);
    }
  }
});

pi.on('didReceiveSettings', (event) => {
  if (isSettings(event.settings)) {
    setSelectValue('change_number', String(event.settings.number || 0));
    setSelectValue('change_background', event.settings.background || 'original');
  }
});

export default pi;
