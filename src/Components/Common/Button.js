import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import BasicButtons from './Button';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';

test('рендерить компонент Button і клікає по ньому', () => {
  const handleClick = jest.fn();
  const { getByText } = render(
    <ThemeProvider theme={theme}>
      <BasicButtons title="Click Me" handleAction={handleClick} />
    </ThemeProvider>
  );

  const button = getByText('Click Me');
  fireEvent.click(button);

  expect(handleClick).toHaveBeenCalledTimes(1);
});
