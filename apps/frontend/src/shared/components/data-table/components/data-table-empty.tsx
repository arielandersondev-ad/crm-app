interface Props {
  message: string;
}

export function DataTableEmpty({ message }: Props) {
  return (
    <div className="py-12 text-center">
      <div className="mb-3 text-5xl">
        📂
      </div>

      <h3 className="font-medium">
        {message}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        Intenta cambiar los filtros.
      </p>
    </div>
  );
}