import type { Config } from 'jest'
import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  dir: './',
})
 
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-jsdom', // jsdom yerine bunu kullanmak daha garantidir
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Kilit Çözüm Burası: node_modules içindeki modülleri yoksayma kuralını esnetiyoruz
  transformIgnorePatterns: [
    // cheerio ve benzeri ESM paketlerini dönüştürsün diye engeli kaldırıyoruz
    "node_modules/(?!cheerio|@cheerio|.*\\.mjs$)" 
  ],
}
 
export default createJestConfig(config)