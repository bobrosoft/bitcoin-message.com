import * as React from 'react';
import {TermsCondPage} from './TermsCondPage';
import {shallow} from 'enzyme';

it('renders without crashing', () => {
  shallow(<TermsCondPage location={{} as any} />);
});
