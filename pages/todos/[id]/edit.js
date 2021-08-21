import "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { db } from "../../../src/lib/firebase";

export default function Edit({ todos }) {
  const router = useRouter();
  console.log(todos);

  const todo = todos.find((to) => {
    return to.id === router.query.id;
  });

  console.log(todo);

  ////////ステートエリア////////
  const [title, setTitle] = useState(todo.title);
  const [limit, setLimit] = useState(todo.limit);
  const [status, setStatus] = useState(todo.status);

  ////////関数エリア////////
  const editTitle = (e) => {
    setTitle(e.target.value);
  };

  const editLimit = (e) => {
    setLimit(e.target.value);
  };

  const editStatus = (e) => {
    setStatus(e.target.value);
  };

  const editTodos = () => {
    const todo = {
      title: title,
      limit: limit,
      status: status,
      // datetime: firebase.firestore.Timestamp.now(),
    };

    db.collection("todos")
      .doc(router.query.id)
      .set(todo,{merge: true})
      .then(() => {
        console.log("Document successfully written!");
        alert("TODOが編集されました");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
        alert("TODOを編集できませんでした");
      });
  };

  const check = title === "" || limit === "" || status === "";

  ////////描画エリア////////
  return (
    <div>
      <h1>TODO編集</h1>

      {/*  */}

      <div>
        <label>
          TODOタイトル
          <input
            type="text"
            name="title"
            maxLength="50"
            placeholder="50文字まで"
            value={title}
            onChange={editTitle}
          />
        </label>
      </div>

      {/*  */}

      <div>
        <label>
          期限
          <input type="date" name="limit" value={limit} onChange={editLimit} />
        </label>
      </div>

      {/*  */}
      <div>
        <label>
          進捗状況
          <select name="status" onChange={editStatus}>
            <option defaultValue value="">
              選択してください
            </option>
            <option value="未完了">未完了</option>
            <option value="途中">途中</option>
            <option value="完了">完了</option>
          </select>
        </label>
      </div>
      {/*  */}

      <br />
      <button onClick={editTodos} disabled={false}>
        TODOを編集する
      </button>

      <Link href={`/todos/${router.query.id}`}>
        <button>戻る</button>
      </Link>
    </div>
  );
}

//////// Next.js関数 ////////
export async function getServerSideProps() {
  const todos = [];
  const ref = await db.collection("todos").orderBy("datetime").get();
  ref.docs.map((doc) => {
    const data = {
      id: doc.id,
      title: doc.data().title,
      limit: doc.data().limit,
      status: doc.data().status,
    };
    todos.push(data);
  });

  return {
    props: {
      todos,
    },
  };
}
