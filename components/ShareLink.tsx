import { FC } from 'react';
import {
  WhatsappShareButton,
  TwitterShareButton,
  EmailShareButton,
  WhatsappIcon,
  TwitterIcon,
  EmailIcon,
} from 'react-share';
import { Box } from 'theme-ui';

interface Props {
  id: string;
}

const ShareLink: FC<Props> = ({ id }) => {
  const url = `https://ubiquiti-real-time-todo-app.vercel.app/todos/${id}`;
  return (
    <Box>
      <TwitterShareButton
        url={url}
        title={'checkout my task'}
        hashtags={['#myTodo', '#myList']}
      >
        <TwitterIcon size="45px" round={true}></TwitterIcon>
      </TwitterShareButton>
      <WhatsappShareButton url={url} title={'checkout my task'}>
        <WhatsappIcon size="45px" round={true}></WhatsappIcon>
      </WhatsappShareButton>
      <EmailShareButton url={url} title={'checkout my task'}>
        <EmailIcon size="45px" round={true}></EmailIcon>
      </EmailShareButton>
    </Box>
  );
};

export default ShareLink;
