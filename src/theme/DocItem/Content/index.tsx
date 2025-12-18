import React from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type { WrapperProps } from '@docusaurus/types';
import ChapterTools from '@site/src/components/ChapterTools';

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): React.JSX.Element {
  // Extract title from document heading or use default
  const title = typeof document !== 'undefined'
    ? document.querySelector('h1')?.textContent || 'Chapter Content'
    : 'Chapter Content';

  return (
    <>
      <ChapterTools title={title} />
      <Content {...props} />
    </>
  );
}
