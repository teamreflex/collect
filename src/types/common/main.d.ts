type PropsWithChildren<P = unknown> = P & { children?: ReactNode };
type PropsWithClassName<P = unknown> = P & { className?: string };
type PropsWithChildrenAndClassName<P = unknown> = PropsWithClassName<P> &
  PropsWithChildren<P>;
type Prettify<T> = {
  [K in keyof T]: T[K];
// eslint-disable-next-line @typescript-eslint/ban-types
} & {};