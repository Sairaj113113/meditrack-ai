import React, {
  useEffect,
  useState,
} from 'react';
import { Text } from 'react-native';

export default function CountdownTimer() {
  const [seconds, setSeconds] =
    useState(120);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) =>
        prev > 0 ? prev - 1 : 0
      );
    }, 1000);

    return () =>
      clearInterval(timer);
  }, []);

  const mins = Math.floor(
    seconds / 60
  );

  const secs = seconds % 60;

  return (
    <Text>
      OTP expires in{' '}
      {mins}:
      {secs
        .toString()
        .padStart(2, '0')}
    </Text>
  );
}