export function isSettings(value: unknown): value is Settings {
  return (value as Settings).hasOwnProperty('number') && (value as Settings).hasOwnProperty('background');
}

export default interface Settings {
  number: number;
  background: string;
}
