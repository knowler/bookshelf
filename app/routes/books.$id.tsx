import { Book } from "@prisma/client";
import {
  ActionFunction,
  Form,
  Link,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
  useCatch,
  useLoaderData,
} from "remix";
import { db } from "~/db.server";

type LoaderData = {
  book: Book;
};

export const loader: LoaderFunction = async ({ params }) => {
  const book = await db.book.findUnique({ where: { id: Number(params.id) } });
  if (!book) throw new Response("No book found.", { status: 404 });
  const data: LoaderData = { book };
  return data;
};

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "/book.css",
  },
];

export const meta: MetaFunction = ({ data }) => ({
  title: `Bookshelf | ${data?.book.title ?? "Book Not Found"}`,
});

export const action: ActionFunction = async ({ request, params }) => {
  switch (request.method) {
    case "DELETE":
      await db.book.delete({ where: { id: Number(params.id) } });
      return redirect("/books");
    default:
      return null;
  }
};

export default function Book() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <nav aria-label="Breadcrumbs">
        <Link to="/books">Books</Link>
      </nav>
      <article>
        <h1>
          {data.book.title} <br />
          <small>by {data.book.author}</small>
        </h1>
        <Form method="delete">
          <button>Delete</button>
        </Form>
      </article>
    </>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <article>
      <h1>
        {caught.status} {caught.data}
      </h1>
    </article>
  );
}
