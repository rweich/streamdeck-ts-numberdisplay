import { Streamdeck } from '@rweich/streamdeck-ts';
import { isSettings } from './Settings';

const plugin = new Streamdeck().plugin();
const numbers: Record<string, number> = {};
const backgrounds: Record<string, string> = {};
const backgroundMap: Record<string, string> = {
  orange: 'images/action1.key.orange.png',
  red: 'images/action1.key.red.png',
  green: 'images/action1.key.green.png',
  blue: 'images/action1.key.blue.png',
};

function getNumber(context: string): number {
  return numbers[context] || 0;
}

function changeNumber(number: number, context: string): void {
  number = number % 10;
  numbers[context] = number;
  showNumber(number, context);
}

function showNumber(number: number, context: string): void {
  plugin.setTitle(String(number), context);
}

function changeBackground(background: string, context: string): void {
  if (backgrounds[context] === background || backgroundMap[background] === undefined) {
    return;
  }

  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement('canvas');

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(image, 0, 0);
    plugin.setImage(canvas.toDataURL('image/png'), context);
  };
  image.src = backgroundMap[background];
  backgrounds[context] = background;
}

function updateSettings(context: string): void {
  plugin.setSettings(context, { number: numbers[context] || 0, background: backgrounds[context] || 'orange' });
}

plugin.on('willAppear', (event) => {
  plugin.getSettings(event.context);
  changeNumber(getNumber(event.context), event.context);
});
plugin.on('didReceiveSettings', (event) => {
  if (isSettings(event.settings)) {
    changeNumber(event.settings.number, event.context);
    changeBackground(event.settings.background, event.context);
  }
});
plugin.on('keyDown', (event) => {
  changeNumber(getNumber(event.context) + 1, event.context);
  updateSettings(event.context);
});

export default plugin;
