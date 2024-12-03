import Link from "next/link";
import { getVideos } from "./lib/firebase/functions";
import Image from "next/image";

export default async function Home() {
  const videos = await getVideos();

  return (
    <main>
      {videos.map((video) => (
        <Link key={video.id} href={`/watch?v=${video.filename}`}>
          <Image
            src={"/thumbnail.png"}
            alt="video"
            width={120}
            height={80}
            className="m-3"
          />
        </Link>
      ))}
    </main>
  );
}

export const revalidate = 0;
