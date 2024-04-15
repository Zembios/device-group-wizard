export enum DeviceType {
  WATER='Water',
  GAS='Gas',
  ENERGY='Energy',
  AIR_QUALITY='Air Quality',
}

export interface Device {
  id: number;
  name: string;
  type: DeviceType
}