export function getNestedValue( obj: any, path: string ) {
  return path
    .split('.')
    .reduce(
      (acc, part) => acc?.[part],
      obj
    );
}