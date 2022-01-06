import { useRef, useEffect, useState, useMemo, FC } from 'react';
import { AspectRatio, Box, useThemeUI, Embed } from 'theme-ui';
import { throttle } from 'lodash';
import Editor from 'rich-markdown-editor';

const YoutubeEmbed: FC<{
  attrs: { href: string; matches: string[] };
  isSelected: boolean;
}> = ({ attrs, isSelected }) => {
  return (
    <AspectRatio key={attrs.matches[1]} ratio={16 / 9}>
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

const RichTextEditor: FC<TextProps> = ({ value, onChange }) => {
  const editorRef = useRef<Editor>(null);
  const [remoteUpdates, setRemoteUpdates] = useState(0);
  useEffect(() => {
    if (editorRef.current?.isBlurred) {
      // value has changed while editor is blurred, means it's a remote update
      setRemoteUpdates((updates) => updates + 1);
    }
  }, [value]);

  const onChangeHandler = useMemo(
    () =>
      throttle(
        () => {
          onChange(editorRef.current?.value() || '');
        },
        100,
        {
          leading: false,
        }
      ),
    []
  );

  return (
    <Box
      my={2}
      sx={{
        '& div': {
          background: 'inherit',
        },
        '#block-menu-container': {
          zIndex: 10000,
        },
      }}
    >
      <Editor
        key={remoteUpdates}
        ref={editorRef}
        embeds={embeds}
        defaultValue={value || ''}
        onKeyDown={onChangeHandler}
        onChange={onChangeHandler}
      />
    </Box>
  );
};

export default RichTextEditor;
