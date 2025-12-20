import React, { useState, useEffect } from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type { WrapperProps } from '@docusaurus/types';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ChapterTools from '@site/src/components/ChapterTools';
import Quiz from '@site/src/components/Quiz';

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): React.JSX.Element {
  const [title, setTitle] = useState('Chapter Content');

  useEffect(() => {
    // Get title from the page heading after render
    const heading = document.querySelector('h1');
    if (heading?.textContent) {
      setTitle(heading.textContent);
    }
  }, []);

  return (
    <>
      <ChapterTools title={title} />
      <Content {...props} />
      <BrowserOnly>
        {() => (
          <div style={{ marginTop: '3rem' }}>
            <Quiz topic={title} />
          </div>
        )}
      </BrowserOnly>
    </>
  );
}
