import { ActionFunction, Form, json, redirect, useActionData } from "remix";
import { db } from "~/db.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  await db.book.create({
    data: {
      title: form.get("title") as string,
      author: form.get("author") as string,
    },
  });

  return redirect("/");
};

export default function NewBook() {
  const actionData = useActionData();

  return (
    <Form method="post">
      <label>
        Title <input type="text" name="title" required />
      </label>
      <label>
        Author <input type="text" name="author" required />
      </label>
      <button>Add Book</button>
    </Form>
  );
}
