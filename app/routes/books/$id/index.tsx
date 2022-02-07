import { useEffect, useRef } from "react";
import { Book } from "@prisma/client";
import {
  ActionFunction,
  Form,
  Link,
  MetaFunction,
  redirect,
  useCatch,
  useMatches,
} from "remix";
import { db } from "~/db.server";

export const meta: MetaFunction = ({ parentsData }) => ({
  title: `Bookshelf | ${
    parentsData["routes/books/$id"].book?.title ?? "Book Not Found"
  }`,
});

export const action: ActionFunction = async ({ request, params }) => {
  switch (request.method) {
    case "DELETE":
      await db.book.delete({ where: { id: params.id } });
      return redirect("/books");
    default:
      return new Response("Unsupported method.", { status: 405 });
  }
};

export default function Book() {
  const { data } = useMatches()[2];
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    asideRef.current?.addEventListener(
      "animationend",
      (event: AnimationEvent) => {
        (event.target as HTMLElement).focus();
      },
      { once: true }
    );
  }, []);

  return (
    <aside ref={asideRef} tabIndex={-1}>
      <h2>
        {data.book.title} <br />
        <small>by {data.book.author}</small>
      </h2>
      <Form method="delete">
        <button>Delete</button>
      </Form>
      <Link to="edit">Edit</Link>
      <Link to="/books" className="dismiss">
        Close
      </Link>
    </aside>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <article>
      <h1>
        {caught.status} {caught.statusText}
      </h1>
      <p>{caught.data}</p>
    </article>
  );
}
