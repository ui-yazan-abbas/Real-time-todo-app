import React, { useRef, useEffect, useState } from 'react';
import { AspectRatio, Box, Embed } from 'theme-ui';
import { throttle } from 'lodash';
import Editor from 'rich-markdown-editor';

const YoutubeEmbed: React.FC<{
  attrs: { href: string; matches: string[] };
  isSelected: boolean;
}> = ({ attrs, isSelected }) => {
  return (
    <AspectRatio ratio={16 / 9}>
      <Embed
        className={isSelected ? 'ProseMirror-selectednode' : ''}
        src={`https://www.youtube.com/embed/${attrs.matches[1]}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </AspectRatio>
  );
};

const embeds = [
  {
    title: 'YouTube',
    keywords: 'youtube video tube google',
    defaultHidden: true,
    // eslint-disable-next-line react/display-name
    icon: () => (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/7/75/YouTube_social_white_squircle_%282017%29.svg"
        width={24}
        height={24}
      />
    ),
    matcher: (url: string) => {
      const matches = url.match(
        /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([a-zA-Z0-9_-]{11})$/i
      );
      if (matches?.length) {
        return matches;
      }
      return false;
    },
    component: YoutubeEmbed,
  },
];

interface TextProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<TextProps> = ({ value, onChange }) => {
  const editorRef = useRef<Editor>(null);
  const [remoteUpdates, setRemoteUpdates] = useState(0);
  useEffect(() => {
    if (editorRef.current?.isBlurred) {
      // value has changed while editor is blurred, means it's a remote update
      setRemoteUpdates((updates) => updates + 1);
    }
  }, [value]);
  return (
    <Box
      my={2}
      sx={{
        '& div': {
          background: 'inherit',
        },
        '#block-menu-container': {
          zIndex: 100,
        },
      }}
    >
      <Editor
        key={remoteUpdates}
        ref={editorRef}
        embeds={embeds}
        defaultValue={value || ''}
        onKeyDown={throttle(
          () => {
            onChange(editorRef.current?.value() || '');
          },
          50,
          {
            leading: false,
          }
        )}
      />
    </Box>
  );
};

export default RichTextEditor;
