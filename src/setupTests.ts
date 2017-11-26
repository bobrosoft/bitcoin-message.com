// Removing warning about requestAnimationFrame (https://github.com/facebookincubator/create-react-app/issues/3199#issuecomment-332842582)
(global as any).requestAnimationFrame = (cb: {}) => {
  setTimeout(cb, 0);
};

// Configuring Enzyme
import {configure} from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});