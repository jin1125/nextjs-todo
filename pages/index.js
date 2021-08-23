import "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "../src/lib/firebase";

export default function Home() {
  ////// データ取得 //////
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    const lists = db
      .collection("todos")
      .orderBy("datetime")
      .onSnapshot((snapshot) => {
        setTodoList(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            limit: doc.data().limit,
            status: doc.data().status,
            datetime: doc.data().datetime.toDate().getTime(0),
          }))
        );
      });

    return () => lists();
  }, []);

  ////// ステートエリア //////
  const [filter, setFilter] = useState("");
  const [imcompleteList, setImcompleteList] = useState([]);
  const [workingList, setWorkingList] = useState([]);
  const [completeList, setCompleteList] = useState([]);
  const [isLogin, setIsLogin] = useState(false);

  //ログイン判定
  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    });
    return () => unSub();
  }, []);

  //ソート機能
  const sortTodo = (e) => {
    if (e.target.value === "asc") {
      todoList.sort(function (a, b) {
        if (a.datetime < b.datetime) {
          return -1;
        } else {
          return 1;
        }
      });

      setTodoList([...todoList]);
    } else if (e.target.value === "desc") {
      todoList.sort(function (a, b) {
        if (a.datetime > b.datetime) {
          return -1;
        } else {
          return 1;
        }
      });

      setTodoList([...todoList]);
    }
  };

  ///// フィルタ機能 /////

  //未完了フィルター
  useEffect(() => {
    const lists = [...todoList];

    const i = lists.filter((list) => list.status === "未完了");

    setImcompleteList([...i]);
  }, [todoList]);

  //途中フィルター
  useEffect(() => {
    const lists = [...todoList];

    const w = lists.filter((list) => list.status === "途中");

    setWorkingList([...w]);
  }, [todoList]);

  //完了フィルター
  useEffect(() => {
    const lists = [...todoList];

    const c = lists.filter((list) => list.status === "完了");

    setCompleteList([...c]);
  }, [todoList]);

  let filtered = [];

  switch (filter) {
    case "all":
      filtered = todoList;
      break;

    case "imcomplete":
      filtered = imcompleteList;
      break;

    case "working":
      filtered = workingList;
      break;

    case "complete":
      filtered = completeList;
      break;

    default:
      filtered = todoList;
  }

  ////////描画エリア////////
  return (
    <div>
      <Head>
        <title>TODOアプリ(Next.js)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/*  */}

      <div>
        <Link href="./login">
          <button>ログイン/新規登録</button>
        </Link>
        <button
          onClick={async () => {
            const result = confirm("ログアウトしますか？");
            if (result) {
              try {
                await auth.signOut();
                alert("ログアウトしました");
              } catch (error) {
                alert("ログアウトできませんでした");
              }
            }
          }}
        >
          ログアウト
        </button>

        {isLogin ? <p>ログイン中です</p> : <p>ログアウト中です</p>}

        <h1>TODO一覧</h1>

        {filtered.map((todo) => (
          <div key={todo.id}>
            <h3>{todo.title}</h3>
            <p>{todo.limit}</p>
            <p>{todo.status}</p>
            <Link href={`/${todo.id}`}>
              <button>詳細</button>
            </Link>
          </div>
        ))}
      </div>

      {/*  */}

      <Link href="/create">
        <button>TODO作成(ログインユーザーのみ)</button>
      </Link>

      {/*  */}

      <div>
        <label>
          並び替え
          <select name="sort" onChange={sortTodo}>
            <option defaultValue value="asc">
              作成日 古い順
            </option>
            <option value="desc">作成日 新しい順</option>
          </select>
        </label>
      </div>
      {/*  */}

      <div>
        <label>
          フィルター
          <select onChange={(e) => setFilter(e.target.value)}>
            <option defaultValue value="all">
              全て表示
            </option>
            <option value="imcomplete">未完了のみ表示</option>
            <option value="working">途中のみ表示</option>
            <option value="complete">完了のみ表示</option>
          </select>
        </label>
      </div>

      {/*  */}
    </div>
  );
}

//////// Next.js関数(ボツ) ////////
// export async function getServerSideProps() {
//   const todos = [];
//   const ref = await db.collection("todos").orderBy("datetime").get();
//   ref.docs.map((doc) => {
//     const data = {
//       id: doc.id,
//       title: doc.data().title,
//       limit: doc.data().limit,
//       status: doc.data().status,
//       datetime: doc.data().datetime.toDate().getTime(0),
//     };
//     todos.push(data);
//   });

//   return {
//     props: {
//       todos,
//     },
//   };
// }
