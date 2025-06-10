// app/fonts.js (optional file)
import { Oswald, Rubik } from 'next/font/google';

export const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
});
