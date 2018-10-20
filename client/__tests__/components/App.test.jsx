import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import AlertFeed from '../../src/components/AlertFeed';


describe('AlertFeed', () => {
  it('should render', () => {
    const wrapper = shallow(
      <AlertFeed
        client={{}}
        latitude={45.555}
        longitude={33.333}
        ramge={10}
      />,
    );

    expect(wrapper.find('.feed').exists()).to.be.true;
  });
});
