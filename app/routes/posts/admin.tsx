import { getPostListing } from "~/models/post.server";
import invariant from "tiny-invariant";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireAdminUser } from "~/session.server";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPostListing>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUser(request);
  const posts = await getPostListing();
  invariant(posts, "no posts found");
  return json<LoaderData>({
    posts,
  });
};

export default function AdminRoute() {
  const { posts } = useLoaderData() as LoaderData;
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">Blog Admin</h1>
      <div className="gap=6 grid grid-cols-4">
        <nav className="col-span-4 md:col-span-1">
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link to={post.slug} className="text-blue-600 underline">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="col-span-4 md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="text-red-500">
      Oh now something went wrong! <pre>{error.message}</pre>
    </div>
  );
}
