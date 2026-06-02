import { TableDensity } from '../types';

export function getDensityClass( density: TableDensity ) {
  switch (density) {
    case 'compact':
      return 'py-2';

    case 'comfortable':
      return 'py-5';

    default:
      return 'py-3';
  }
}