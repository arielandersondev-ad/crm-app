const styles = {
  success:
    'bg-green-100 text-green-700',

  danger:
    'bg-red-100 text-red-700',

  warning:
    'bg-yellow-100 text-yellow-700',

  info:
    'bg-blue-100 text-blue-700',

  neutral:
    'bg-gray-100 text-gray-700',
};

interface Props {
  label: string;
  color?: keyof typeof styles;
}

export function DataTableStatus({ label, color = 'neutral' }: Props) {
  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-2
        py-1
        text-xs
        font-medium
        ${styles[color]}
      `}
    >
      {label}
    </span>
  );
}