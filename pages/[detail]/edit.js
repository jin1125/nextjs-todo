import firebase from "firebase/app";
import "firebase/firestore";
import Head from "next/head";
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
    <>
      <Head>
        <title>TODO編集(Next.js)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="font-mono">
        <div className="text-center">
          <div className="w-3/5 mx-auto py-14">
            <div className="shadow-xl">
              <div className="bg-blue-400 py-3 rounded-t">
                <h1 className="text-white font-bold text-3xl">TODO編集</h1>
              </div>

              {/*  */}
              <div className="bg-white rounded-b">
                <div className="pt-5">
                  <div className="my-3">
                    <label>
                      <span className="mr-2">TODOタイトル</span>
                      <input
                        className="bg-blue-100 placeholder-blue-300 pl-2 rounded"
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

                  <div className="my-3">
                    <label>
                      <span className="mr-2">期限</span>
                      <input
                        className="bg-blue-100 pl-2 rounded"
                        type="date"
                        name="limit"
                        value={limit}
                        onChange={editLimit}
                      />
                    </label>
                  </div>

                  {/*  */}
                  <div className="my-3">
                    <label>
                      <span className="mr-2">進捗状況</span>
                      <select
                        className="bg-blue-100 px-2 rounded"
                        name="status"
                        onChange={editStatus}
                      >
                        <option defaultValue value="">
                          選択してください
                        </option>
                        <option value="未完了">未完了</option>
                        <option value="途中">途中</option>
                        <option value="完了">完了</option>
                      </select>
                    </label>
                  </div>
                </div>
                {/*  */}

                <div>
                  <button
                    className="bg-blue-500 text-lg font-bold text-white rounded-full py-1 px-4 mt-5 shadow hover:bg-blue-400 disabled:opacity-50"
                    onClick={() => editTodos(`/${router.query.detail}`)}
                    disabled={check}
                  >
                    TODOを編集する
                  </button>
                </div>

                <div className="text-right">
                  <Link href={`/${router.query.detail}`}>
                    <button className="text-xs p-2 hover:text-gray-300">
                      TODO詳細へ戻る
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
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
