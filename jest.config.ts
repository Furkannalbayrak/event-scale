import type { Config } from 'jest'
import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  // Next.js uygulamanızın bulunduğu dizin
  dir: './',
})
 
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Test dosyalarını nerede arayacak?
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], 
}
 
export default createJestConfig(config)