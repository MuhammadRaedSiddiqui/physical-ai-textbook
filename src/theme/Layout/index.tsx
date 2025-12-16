import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import type LayoutType from '@theme/Layout';

type Props = React.ComponentProps<typeof LayoutType>;

export default function Layout(props: Props): React.ReactElement {
  return (
    <>
      <OriginalLayout {...props} />
    </>
  );
}
