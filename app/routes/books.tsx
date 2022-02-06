import { Book } from "@prisma/client";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/db.server";

type LoaderData = {
  books: Array<Book>;
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
    <main>
      <h1>Bookshelf</h1>
      <Link to="new">Add Book</Link>
      <ul>
        {data.books.map((book) => (
          <li key={book.id}>
            <Link to={book.id.toString()}>
              <span className="title">{book.title}</span>
              <span className="author">{book.author}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
