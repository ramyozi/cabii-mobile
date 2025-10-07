import { SWRConfig } from 'swr';

export const SwrProvider = ({ children }: any) => {
  return <SWRConfig>{children}</SWRConfig>;
};
