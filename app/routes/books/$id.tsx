import { Book } from "@prisma/client";
import { LoaderFunction, Outlet } from "remix";
import { db } from "~/db.server";

type LoaderData = {
  book: Book;
};

export const loader: LoaderFunction = async ({ params }) => {
  const book = await db.book.findUnique({ where: { id: Number(params.id) } });
  if (!book)
    throw new Response(`Cannot find a book with the id of ${params.id}`, {
      status: 404,
      statusText: "Book not found.",
    });
  const data: LoaderData = { book };
  return data;
};

export default function () {
  return <Outlet />;
}
