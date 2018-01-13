import * as React from 'react';
import './ShareButtons.css';

interface Props {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
}

export class ShareButtons extends React.Component<Props> {
  static defaultProps = {
    url: location.href,
  };
  
  get encodedUrl(): string {
    return encodeURIComponent(this.props.url || '');
  }

  get encodedTitle(): string {
    return encodeURIComponent(this.props.title || '');
  }

  get encodedDescription(): string {
    return encodeURIComponent(this.props.description || '');
  }

  get encodedImage(): string {
    return encodeURIComponent(this.props.image || '');
  }
  
  render() {
    return (
      <p className="ShareButtons">
        <a target="_blank" rel="noopener" title="Facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${this.encodedUrl}&title=${this.encodedTitle}&description=${this.encodedDescription}`}><i className="fa fa-facebook-official"/></a>
        <a target="_blank" rel="noopener" title="Twitter" href={`https://twitter.com/intent/tweet?url=${this.encodedUrl}&text=${this.encodedTitle}&via=BitcoinMessage`}><i className="fa fa-twitter"/></a>
        <a target="_blank" rel="noopener" title="Vkontakte" href={`https://vk.com/share.php?url=${this.encodedUrl}&title=${this.encodedTitle}&description=${this.encodedDescription}&image=${this.encodedImage}&noparse=true`}><i className="fa fa-vk"/></a>
      </p>
    );
  }
}