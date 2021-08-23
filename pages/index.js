import "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";

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
    <>
      <Head>
        <title>TODOアプリ(Next.js)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/*  */}
      <main className=" font-mono">
        <div className="text-center">
          <div className="w-3/5 mx-auto py-14">
            <div className="shadow-xl">
              <div className="bg-blue-400 py-3 rounded-t">
                <h1 className="text-white font-bold text-3xl">TODO一覧</h1>
              </div>

              {/*  */}

              <div className="bg-white rounded-b">
                <div className="grid grid-cols-3 gap-4 py-5">
                  <div>
                    <Link href="./login">
                      <button className="bg-blue-500 font-bold text-white rounded-full py-1 px-4">
                        ログイン/新規登録
                      </button>
                    </Link>
                  </div>

                  <div>
                    {isLogin ? (
                      <p class="text-blue-500 font-bold text-lg">ログイン中です</p>
                    ) : (
                      <p class="text-red-500  font-bold text-lg">ログアウト中です</p>
                    )}
                  </div>

                  <div>
                    <button
                      className="bg-red-500 font-bold text-white rounded-full py-1 px-4 shadow hover:bg-red-400"
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
                  </div>
                </div>
                {/*  */}
                      {/*  */}
                <div className="grid grid-cols-2 py-5">
                  <div>
                    <label>
                    <span className="mr-2">並び替え</span>
                      <select className="bg-blue-100 px-2 rounded" name="sort" onChange={sortTodo}>
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
                    <span className="mr-2">フィルター</span>
                      <select className="bg-blue-100 px-2 rounded" onChange={(e) => setFilter(e.target.value)}>
                        <option defaultValue value="all">
                          全て表示
                        </option>
                        <option value="imcomplete">未完了のみ表示</option>
                        <option value="working">途中のみ表示</option>
                        <option value="complete">完了のみ表示</option>
                      </select>
                    </label>
                  </div>
                </div>
                {/*  */}
                
                <div className='grid grid-cols-2 my-10'>
                {filtered.map((todo) => (
                  <div key={todo.id} className='bg-blue-500 rounded m-3 shadow-xl'>
                    <div className='bg-white border-2 border-blue-500 rounded-t'>
                    <h3 className='text-blue-500  py-2 text-lg break-words'>{todo.title}</h3>
                    </div>
                    <p  className='text-white my-2'>{`期限 : ${todo.limit}`}</p>
                    <p  className='text-white my-2'>{`進捗状況 : ${todo.status}`}</p>
                    <Link href={`/${todo.id}`}>
                      <button className='bg-white my-4 font-bold text-blue-600 rounded-full py-1 px-4 hover:bg-blue-500 hover:text-white'>詳細</button>
                    </Link>
                  </div>
                ))}
                </div>

                {/*  */}
                <div>
                  <Link href="/create">
                    <button className="bg-blue-500 text-lg font-bold text-white rounded-full py-1 px-4 mt-5 shadow hover:bg-blue-400 my-8">
                      TODO作成(ログインユーザーのみ)
                    </button>
                  </Link>
                </div>

                

              </div>
              {/*  */}
            </div>
          </div>
        </div>
      </main>
    </>
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
