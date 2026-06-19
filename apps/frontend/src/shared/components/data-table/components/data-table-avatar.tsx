interface Props {
  value: string;
}

export function DataTableAvatar({ value }: Props) {
  const initials = value
    ?.split(' ')
    ?.map((x) => x[0])
    ?.slice(0, 2)
    ?.join('')
    ?.toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div
        className="
          flex h-9 w-9 items-center justify-center
          rounded-full
          bg-primary/10
          text-xs
          font-semibold
          text-primary
        "
      >
        {initials}
      </div>

      <span className="font-medium">
        {value}
      </span>
    </div>
  );
}