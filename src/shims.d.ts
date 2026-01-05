declare module 'zustand';
declare module 'zustand/middleware';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare global {
  namespace React {
    interface Attributes { }
    interface ComponentProps<T> { }
    interface FC<P = {}> {
      (props: P & { children?: React.ReactNode }): JSX.Element | null;
      displayName?: string;
    }
    type ReactNode = any;
  }
  type Timeout = any;
}
