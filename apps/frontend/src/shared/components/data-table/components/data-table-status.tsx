const styles = {
  success:
    'bg-success/10 text-success',

  danger:
    'bg-destructive/10 text-destructive',

  warning:
    'bg-warning/10 text-warning',

  info:
    'bg-primary/10 text-primary',

  neutral:
    'bg-muted text-muted-foreground',
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