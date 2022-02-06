import { useEffect, useRef } from "react";
import {
  ActionFunction,
  Form,
  Link,
  MetaFunction,
  redirect,
  useMatches,
} from "remix";
import { db } from "~/db.server";

export const meta: MetaFunction = ({ parentsData }) => ({
  title: `Bookshelf | ${
    parentsData["routes/books/$id"].book?.title + " | Edit" ?? "Book Not Found"
  }`,
});

export const action: ActionFunction = async ({ request, params }) => {
  switch (request.method) {
    case "DELETE": {
      await db.book.delete({ where: { id: Number(params.id) } });
      return redirect("/books");
    }
    case "PATCH": {
      const formData = await request.formData();
      await db.book.update({
        where: { id: Number(params.id) },
        data: {
          title: formData.get("title") as string,
          author: formData.get("author") as string,
        },
      });

      return redirect(`/books/${params.id}`);
    }
    default:
      return new Response("Method not supported", { status: 405 });
  }
};

export default function EditBook() {
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
      <Form method="patch">
        <div>
          <label>Title</label>
          <input type="text" name="title" defaultValue={data.book.title} />
        </div>
        <div>
          <label>Author</label>
          <input type="text" name="author" defaultValue={data.book.author} />
        </div>
        <button>Update Book</button>
      </Form>
      <Form method="delete">
        <button>Delete Book</button>
      </Form>
      <Link to={`/books/${data.book.id}`} className="dismiss">
        Close
      </Link>
    </aside>
  );
}
