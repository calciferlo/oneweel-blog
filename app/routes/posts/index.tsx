import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getPostListing } from "~/models/post.server";
import { useOptionalAdminUser } from "~/utils";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPostListing>>;
};

export const loader: LoaderFunction = async () => {
  const posts = await getPostListing();
  return json<LoaderData>({
    posts,
  });
};

export default function PostsRoute() {
  const { posts } = useLoaderData() as LoaderData;
  const adminUser = useOptionalAdminUser();

  return (
    <main>
      <h1>Posts</h1>
      {adminUser ? (
        <Link to="admin" className="text-red-600 underline">
          Admin
        </Link>
      ) : null}
      <ul>
        {posts.map((post) => (
          <Link
            key={post.slug}
            prefetch="intent"
            to={post.slug}
            className="flex text-xl text-blue-600 underline"
          >
            {post.title}
          </Link>
        ))}
      </ul>
    </main>
  );
}
