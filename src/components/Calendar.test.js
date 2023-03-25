import React from 'react';
import { render } from '@testing-library/react';
import Calendar from './Calendar';

const events = [   {
    id: 1,
    start: "17:00",
    duration: 60,
  },
  {
    id: 2,
    start: "17:00",
    duration: 120,
  },]

describe('Button component', () => {
  it('matches the snapshot', () => {
    const { container } = render(<Calendar     events={events}
        startingHour={9}
        endingHour={21} />);
    expect(container).toMatchSnapshot();
  });
});