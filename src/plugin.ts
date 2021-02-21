import {
  GetSettingsEvent,
  IncomingEvents,
  IncomingPluginEvents,
  SetSettingsEvent,
  SetTitleEvent,
  Streamdeck,
} from '@rweich/streamdeck-ts';
import { isSettings } from './Settings';

const plugin = new Streamdeck().plugin();
const numbers: Record<string, number> = {};

function getNumber(context: string): number {
  return numbers[context] || 0;
}

function changeNumber(number: number, context: string): void {
  number = number % 10;
  numbers[context] = number;
  showNumber(number, context);
  plugin.sendEvent(new SetSettingsEvent(context, { number, background: 'orange' }));
}

function showNumber(number: number, context: string): void {
  plugin.sendEvent(new SetTitleEvent(String(number), context));
}

plugin.on(IncomingPluginEvents.WillAppear, (event) => {
  plugin.sendEvent(new GetSettingsEvent(event.context));
  changeNumber(getNumber(event.context), event.context);
});
plugin.on(IncomingEvents.DidReceiveSettings, (event) => {
  console.log('islike', isSettings(event.settings));
  if (isSettings(event.settings)) {
    changeNumber(event.settings.number, event.context);
  }
});
plugin.on(IncomingPluginEvents.KeyDown, (event) => {
  changeNumber(getNumber(event.context) + 1, event.context);
});

export default plugin;
