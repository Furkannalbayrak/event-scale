import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Bu kurallar hataları engellemek yerine sadece uyarı verir veya kapatır
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // 'any' kullanımına izin ver
      "@typescript-eslint/no-unused-vars": "warn", // Kullanılmayan değişkenleri sadece uyar (error verme)
      "react/no-unescaped-entities": "off", // HTML içinde ' işareti kullanımına izin ver
      "@next/next/no-img-element": "off", // <img /> kullanımına izin ver
    },
  },
];

export default eslintConfig;