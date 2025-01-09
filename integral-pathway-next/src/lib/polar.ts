import { Polar } from '@polar-sh/sdk'

// Check for environment variables
const accessToken = process.env.NEXT_PUBLIC_POLAR_ACCESS_TOKEN || process.env.POLAR_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error('NEXT_PUBLIC_POLAR_ACCESS_TOKEN or POLAR_ACCESS_TOKEN is not set in environment variables');
}

export const api = new Polar({
  accessToken,
  server: 'production' // Switching to production since sandbox might be causing issues
})