import Link from "next/link";

export default function Home() {
  return (
    <section className="">
      <div className="border border-black flex flex-col justify-center items-center h-screen gap-3 ">
        <h1 className="font-bold text-xl">Bienvenido al chat</h1>
        <Link
          href="/chat"
          className="px-5 py-1 border border-black rounded-lg hover:bg-gray-100"
        >
          Unirse
        </Link>
      </div>
    </section>
  );
}
