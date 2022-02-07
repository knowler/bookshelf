import { Book } from "@prisma/client";
import { MetaFunction } from "@remix-run/react/routeModules";
import { Link, LoaderFunction, Outlet, useLoaderData } from "remix";
import { db } from "~/db.server";

export const meta: MetaFunction = () => ({
  title: "Bookshelf | Books",
});

type LoaderData = {
  books: Array<Pick<Book, "id" | "title" | "author">>;
};

export const loader: LoaderFunction = async () => {
  const books = await db.book.findMany({
    take: 12,
    select: { id: true, title: true, author: true },
    orderBy: { createdAt: "desc" },
  });

  const data: LoaderData = {
    books,
  };

  return data;
};

export default function Index() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <header>
        <h1>Bookshelf</h1>
        <nav aria-label="primary">
          <Link to="/books/new">Add Book</Link>
        </nav>
      </header>
      <main>
        <article>
          <ul>
            {data.books.map((book) => (
              <li key={book.id}>
                <Link to={book.id}>
                  <span className="title">{book.title}</span>
                  <span className="author">{book.author}</span>
                </Link>
              </li>
            ))}
          </ul>
        </article>
        <Outlet />
      </main>
    </>
  );
}
