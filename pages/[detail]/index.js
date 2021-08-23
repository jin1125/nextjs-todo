import firebase from "firebase/app";
import "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export default function Detail() {
  const router = useRouter();

  //////// ステートエリア ////////
  const [todo, setTodo] = useState({});
  const [id, setId] = useState("");
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);

  //////// firebaseデータ取得 ////////
  useEffect(() => {
    const lists = db.collection("todos").doc(router.query.detail);
    lists
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          setTodo(doc.data());
          setId(doc.id);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, [router.query.detail]);

  //////// 関数エリア ////////
  const inputCmt = (e) => {
    setComment(e.target.value);
  };

  const pushCmt = () => {
    const cmt = {
      comment: comment,
      datetime: firebase.firestore.Timestamp.now(),
      todoId: id,
    };

    db.collection("comments")
      .add(cmt)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        alert("コメントしました");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        alert("コメントできませんでした");
      });

    setComment("");
  };

  useEffect(() => {
    if (id) {
      const unSub = db
        .collection("comments")
        .where("todoId", "==", id)
        .orderBy("datetime")
        .onSnapshot((snapshot) => {
          setCommentList(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              comment: doc.data().comment,
            }))
          );
        });

      return () => unSub();
    }
  }, [id]);

  const todoDelete = (path) => {
    const result = confirm("このTODOを削除しますか？");
    if (result) {
      db.collection("todos")
        .doc(id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          Router.push(path);
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    }
  };

  const cmtDelete = (id) => {
    const result = confirm("このコメントを削除しますか？");
    if (result) {
      db.collection("comments")
        .doc(id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    }
  };

  ////////描画エリア////////
  return (
    <>
      <Head>
        <title>TODO詳細(Next.js)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=" font-mono">
        <div className="text-center">
          <div className="w-3/5 mx-auto py-14">
            <div className="shadow-xl">
              <div className="bg-blue-400 py-3 rounded-t">
                <h1 className="text-white font-bold text-3xl">TODO詳細</h1>
              </div>

              <div className="bg-white rounded-b">
                <div className="py-5">
                  <h3 className='font-bold text-3xl text-blue-600 mt-3 mb-6'>
                    <span className='border-b-8 border-blue-300 border-opacity-50 break-words'>{todo.title}</span>
                    </h3>
                  <p className='my-3'>{`期限の 『${todo.limit}』 までにやりましょう！`}</p>
                  <p className='my-3'>{`現在、 『${todo.status}』 です！`}</p>

                  {id && todo ? (
                    <Link
                      as={`/${id}/edit`}
                      href={{ pathname: `/[detail]/edit`, query: todo }}
                    >
                      <button className="bg-blue-500 font-bold text-white rounded-full py-1 px-4 mt-5 shadow hover:bg-blue-400 mr-3">編集(ログインユーザーのみ)</button>
                    </Link>
                  ) : (
                    ""
                  )}

                  <button className="bg-red-500 font-bold text-white rounded-full py-1 px-4 mt-5 shadow hover:bg-red-400" onClick={() => todoDelete("/")}>削除</button>
                </div>
                {/*  */}
                <div>
                  <h3 className='text-blue-400 font-bold text-lg mt-7'>コメント</h3>
                    <input
                    className="bg-blue-100 text-xs placeholder-blue-300 py-1 pl-2 rounded-l"
                      type="text"
                      name="comment"
                      maxLength="30"
                      placeholder="30文字まで"
                      value={comment}
                      onChange={inputCmt}
                    />

                  <button className="bg-blue-500 text-xs font-bold text-white rounded-r py-1 px-2 shadow hover:bg-blue-400 disabled:opacity-50" onClick={pushCmt} disabled={comment === ""}>
                  コメントする
                  </button>

                  {commentList.map((cmt) => (
                    <div key={cmt.id} className='my-4'>
                      <span className='text-blue-400'>{cmt.comment}</span>
                      <button className="bg-red-500 text-white text-xs rounded ml-3  px-2 shadow hover:bg-red-400" onClick={() => cmtDelete(cmt.id)}>削除</button>
                    </div>
                  ))}
                </div>

                <div className="text-right">
                  <Link href="/">
                    <button className='text-xs p-2 hover:text-gray-300'>TODO一覧へ戻る</button>
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
// export const getStaticPaths = async () => {
//   // 外部APIエンドポイントを呼び出しデータ取得
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

//   // 事前ビルドしたいパスを指定
//   const paths = todos.map((todo) => ({
//     params: {
//       // ファイル名と合わせる ※文字列指定
//       id: todo.id.toString(),
//     },
//   }));
//   // paths：事前ビルドするパス対象を指定するパラメータ
//   // fallback：事前ビルドしたパス以外にアクセスしたときのパラメータ true:カスタム404Pageを表示 false:404pageを表示
//   return { paths, fallback: false };
// };

// paramsには上記pathsで指定した値が入る（1postずつ）
// export const getStaticProps = async ({ params }) => {
//   //firebaseからtodosを取得
//   const todos = [];
//   const ref1 = await db.collection("todos").orderBy("datetime").get();
//   ref1.docs.map((doc) => {
//     const data = {
//       id: doc.id,
//       title: doc.data().title,
//       limit: doc.data().limit,
//       status: doc.data().status,
//     };
//     todos.push(data);
//   });

//   const todo = todos.find((to) => {
//     return to.id === params.id;
//   });

//   // ページコンポーネントにpropsとしてに渡す
//   return {
//     props: {
//       todo,
//     },
//   };
// };

// export async function getStaticProps() {
//   const comments = [];
//   const ref = await db.collection('comments').orderBy('datetime').get();
//   ref.docs.map((doc) => {
//     const data = {
//       id: doc.id,
//       comment: doc.data().comment,
//     };
//     comments.push(data);
//   });

//   return {
//     props: {
//       comments,
//     },
//   };
// }
