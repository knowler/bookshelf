import { useEffect, useRef } from "react";
import {
  ActionFunction,
  Form,
  Link,
  MetaFunction,
  redirect,
  useTransition,
} from "remix";
import { db } from "~/db.server";

export const meta: MetaFunction = () => ({
  title: "Bookshelf | Add Book",
});

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case "POST": {
      const formData = await request.formData();
      const title = formData.get("title") as string;
      const author = formData.get("author") as string;

      const book = await db.book.create({
        data: { title, author },
      });

      return redirect(`/books/${book.id}`);
    }
    default:
      return null;
  }
};

export default function NewBook() {
  const transition = useTransition();
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
      <h2>Add Book</h2>
      <Form method="post">
        <fieldset disabled={transition.state === "submitting"}>
          <label>
            Title <input type="text" name="title" required />
          </label>
          <label>
            Author <input type="text" name="author" required />
          </label>
          <button>
            {transition.state === "submitting" ? "Adding Book" : "Add Book"}
          </button>
        </fieldset>
      </Form>
      <Link to="/books" className="dismiss">
        Close
      </Link>
    </aside>
  );
}
