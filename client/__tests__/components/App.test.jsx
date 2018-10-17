import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import AlertFeed from '../../src/components/AlertFeed';
// import AlertCamera from '../../src/components/create-alert/Camera';

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
    // console.log(wrapper.text());
    expect(wrapper.find('.feed').exists()).to.be.true;
  });
});

// describe('AlertCamera', () => {
//   it('should render', () => {
//     const wrapper = shallow(
//       <AlertCamera />,
//     );
//     // console.log(wrapper.text());
//     expect(wrapper.find('MapGL').exists()).to.be.false;
//   });
// });