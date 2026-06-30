import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  // eslint-plugin-react's "detect" version lookup calls the removed context.getFilename()
  // under ESLint 10 and crashes; pin the React version to skip auto-detection.
  { settings: { react: { version: '19.2.7' } } },
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      'generated/**',
      'node_modules/**',
    ],
  },
];

export default eslintConfig;
