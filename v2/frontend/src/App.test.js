import { render, screen } from '@testing-library/react';
import App from './App';
import axios from 'axios';

test('renders render title', () => {
  render(<App />);
  const title = screen.getByText(/The Minimalist Entrepeneur/i);
  expect(title).toBeInTheDocument();
});




test('the data is flowing', async () => {
  const res = await axios.get(`https://pure-hollows-59166.herokuapp.com/api`)
  // expect(res.data).toBe('peanut butter');
  res.data.forEach(review => {
    expect(review).toHaveProperty('_id')
    expect(review).toHaveProperty('rating')
    expect(review).toHaveProperty('message')
  })

});

test('niko is finished', async () => {
  expect('niko').not.toEqual('asleep')
})

