// This file must be a CommonJS module to properly import next-auth/providers/credentials
// which is a CommonJS module with a default export
const credentials = require('next-auth/providers/credentials');

export const CredentialsProvider = credentials.default;