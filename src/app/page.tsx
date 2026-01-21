
export default function Home() {
  console.log("DATABASE URL TEST:", process.env.DATABASE_URL); // <-- BU SATIRI EKLE

  return (
    <div className="text-center font-bold text-2xl mt-10">
      Etkinlik Platformu
      <p className="text-sm font-normal mt-4">Lütfen yukarıdan giriş yapın.</p>
    </div>
  );
}
