import { isSomething } from 'ts-type-guards';

export function isSettings(value: unknown): value is Settings {
  return (
    (value as Settings).hasOwnProperty('number')
    && isSomething((value as Settings).number)
    && (value as Settings).hasOwnProperty('background')
    && isSomething((value as Settings).background)
  );
}

export type Settings = {
  number: string;
  background: string;
};
