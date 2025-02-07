'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = (props: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      {...props}
      theme={theme as 'light' | 'dark'}
      className="toaster"
    />
  );
};

export { Toaster };
