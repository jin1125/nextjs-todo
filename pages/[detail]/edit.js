import firebase from "firebase/app";
import "firebase/firestore";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";

export default function Edit() {
  const router = useRouter();

  ////////ステートエリア////////
  const [title, setTitle] = useState(router.query.title);
  const [limit, setLimit] = useState(router.query.limit);
  const [status, setStatus] = useState("");

  //////////関数エリア////////
  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      !user && Router.push(`/${router.query.detail}`);
    });
    return () => unSub();
  }, []);

  const editTitle = (e) => {
    setTitle(e.target.value);
  };

  const editLimit = (e) => {
    setLimit(e.target.value);
  };

  const editStatus = (e) => {
    setStatus(e.target.value);
  };

  const editTodos = (path) => {
    const todo = {
      title: title,
      limit: limit,
      status: status,
      datetime: firebase.firestore.Timestamp.now(),
    };

    db.collection("todos")
      .doc(router.query.detail)
      .set(todo, { merge: true })
      .then(() => {
        console.log("Document successfully written!");
        alert("TODOが編集されました");
        Router.push(path);
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
      <button
        onClick={() => editTodos(`/${router.query.detail}`)}
        disabled={check}
      >
        TODOを編集する
      </button>

      <Link href={`/${router.query.detail}`}>
        <button>戻る</button>
      </Link>
    </div>
  );
}

//////// Next.js関数 ////////
// export async function getServerSideProps() {
//   const todos = [];
//   const ref = await db.collection("todos").orderBy("datetime").get();
//   ref.docs.map((doc) => {
//     const data = {
//       id: doc.id,
//       title: doc.data().title,
//       limit: doc.data().limit,
//       status: doc.data().status,
//     };
//     todos.push(data);
//   });

//   return {
//     props: {
//       todos,
//     },
//   };
// }
