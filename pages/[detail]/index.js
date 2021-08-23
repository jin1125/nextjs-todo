import firebase from "firebase/app";
import "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Router from 'next/router'
import { db } from "../../src/lib/firebase";

export default function Detail() {
  const router = useRouter();

  //////// ステートエリア ////////
  const [todo,setTodo] = useState({});
  const [id,setId] = useState('');
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);


  //////// firebaseデータ取得 ////////
  useEffect(()=>{
 
  const lists = db.collection("todos").doc(router.query.detail);
  lists
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        setTodo(doc.data())
        setId(doc.id);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
    
  },[router.query.detail])


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
    if(id){
      const unSub = db
        .collection("comments")
        .where("todoId", "==", id )
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
    <div>
      <h1>TODO詳細</h1>
      <h3>{todo.title}</h3>
     <p>{todo.limit}</p>
      <p>{todo.status}</p>

      {id && todo ? <Link as={`/${id}/edit`}
        href={{ pathname: `/[detail]/edit`, query: todo }}
      >
        <button>編集(ログインユーザーのみ)</button>
        </Link>:''}

   
        

      

      <button onClick={() => todoDelete("/")}>削除</button>

      <div>
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
      <button onClick={pushCmt} disabled={comment === ''}>書き込む</button>

      {commentList.map((cmt) => (
        <div key={cmt.id}>
          <span>{cmt.comment}</span>
          <button onClick={() => cmtDelete(cmt.id)}>削除</button>
        </div>
      ))}
      </div>

      <Link href="/">
        <button>TODO一覧へ戻る</button>
      </Link> 
    </div>
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
