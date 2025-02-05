import { prisma } from "@/libs/prisma.config";
import Post from "./Post";

const Feed = async () => {
  const posts = await prisma.post.findMany();

  console.log(posts, "<---feedcomponent");

  return (
    <section className="b-rose-600">
      {posts.map((post) => (
        <div key={post.id}>
          <Post />
        </div>
      ))}
    </section>
  );
};

export default Feed;
