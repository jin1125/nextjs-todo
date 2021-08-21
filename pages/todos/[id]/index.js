import firebase from "firebase/app";
import "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "../../../src/lib/firebase";

// post：getStaticPropsから取得したデータ
export default ({todo}) => {
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);

  const inputCmt = (e) => {
    setComment(e.target.value)
  };

  const pushCmt =()=>{

    const cmt = {
      comment: comment,
      datetime: firebase.firestore.Timestamp.now(),
      todoId:todo.id
    };

    db.collection("comments")
      .add(cmt)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        alert('コメントしました');
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        alert('コメントできませんでした');
      });

    setComment("");
  }

  useEffect(()=>{
    //firebaseからcommentsを取得
    console.log(todo.id);


  const unSub = db.collection('comments').where('todoId','==',todo.id).orderBy('datetime').onSnapshot((snapshot)=>{
    setCommentList(
      snapshot.docs.map((doc)=>({
        id:doc.id,
        comment: doc.data().comment
      }))
      
      )
  })

  return ()=> unSub()
  },[])


  return (
    <div>
      <h1>TODO詳細</h1>
      <h3>{todo.title}</h3>
      <p>{todo.limit}</p>
      <p>{todo.status}</p>

      <Link href={`/todos/${todo.id}/edit`}>
        <button>編集</button>
      </Link>

      <button>削除</button>

      <Link href="/todos">
        <button>TODO一覧へ戻る</button>
      </Link>

      <h3>コメント</h3>

      <label>
        コメント入力
        <input
          type="text"
          name="comment"
          maxLength="30"
          placeholder="30文字まで"
          value={comment}
          onChange={inputCmt}
        />
      </label>
      <button onClick={pushCmt}>書き込む</button>

      {commentList.map((cmt) => (
          <div key={cmt.id}>
            <p>{cmt.comment}</p>
          </div>
        ))}
    </div>
  );
};

export const getStaticPaths = async () => {
  // 外部APIエンドポイントを呼び出しデータ取得
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

  // 事前ビルドしたいパスを指定
  const paths = todos.map((todo) => ({
    params: {
      // ファイル名と合わせる ※文字列指定
      id: todo.id.toString(),
    },
  }));
  // paths：事前ビルドするパス対象を指定するパラメータ
  // fallback：事前ビルドしたパス以外にアクセスしたときのパラメータ true:カスタム404Pageを表示 false:404pageを表示
  return { paths, fallback: false };
};

// paramsには上記pathsで指定した値が入る（1postずつ）
export const getStaticProps = async ({ params }) => {

  //firebaseからtodosを取得
  const todos = [];
  const ref1 = await db.collection("todos").orderBy("datetime").get();
  ref1.docs.map((doc) => {
    const data = {
      id: doc.id,
      title: doc.data().title,
      limit: doc.data().limit,
      status: doc.data().status,
    };
    todos.push(data);
  });

  const todo = todos.find((to) => {
    return to.id === params.id;
  });

  
  // ページコンポーネントにpropsとしてに渡す
  return {
    props: {
      todo,
    },
  };
};


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
