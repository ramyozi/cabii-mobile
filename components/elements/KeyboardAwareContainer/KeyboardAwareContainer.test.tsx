import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Keyboard, Text } from 'react-native';
import KeyboardAwareContainer from './KeyboardAwareContainer';

jest.spyOn(Keyboard, 'dismiss').mockImplementation(() => {});

describe('<KeyboardAwareContainer />', () => {
  it('renders children correctly', () => {
    render(
      <KeyboardAwareContainer>
        <Text>Form Content</Text>
      </KeyboardAwareContainer>,
    );
    expect(screen.getByText(/Form Content/i)).toBeTruthy();
  });

  it('dismisses keyboard when tapping anywhere', () => {
    const { getByText } = render(
      <KeyboardAwareContainer>
        <Text>Tap here</Text>
      </KeyboardAwareContainer>,
    );

    fireEvent.press(getByText(/Tap here/i));
    expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
  });

  it('renders correctly in scrollable mode', () => {
    render(
      <KeyboardAwareContainer scrollable>
        <Text>Scrollable Content</Text>
      </KeyboardAwareContainer>,
    );
    expect(screen.getByText(/Scrollable Content/i)).toBeTruthy();
  });
});
