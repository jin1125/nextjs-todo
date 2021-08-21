// import Link from 'next/link'
// import { db } from '../../src/lib/firebase';

// // post：getStaticPropsから取得したデータ
// export default ({ todo }) => {
//   return (
//     <div>
//       <h3>{todo.title}</h3>
//       <p>{todo.limit}</p>
//       <p>{todo.status}</p>

//       <Link href="/[id]/edit">
//         <button>編集</button>
//       </Link>


//         <button>削除</button>


//       <Link href="/todos">
//         <button>TODO一覧へ戻る</button>
//       </Link>
//     </div>
//   )
// }

// export const getStaticPaths = async () => {
//   // 外部APIエンドポイントを呼び出しデータ取得
//   const todos = [];
//   const ref = await db.collection('todos').orderBy('datetime').get();
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
//       id: [todo.id.toString(),'edit']
//     },
//   }))
//   // paths：事前ビルドするパス対象を指定するパラメータ
//   // fallback：事前ビルドしたパス以外にアクセスしたときのパラメータ true:カスタム404Pageを表示 false:404pageを表示
//   return { paths, fallback: false }
// }

// // paramsには上記pathsで指定した値が入る（1postずつ）
// export const getStaticProps = async ({ params }) => {  
//   // 外部エンドポイントを呼び出しデータ取得

//   const todos = [];
//   const ref = await db.collection('todos').orderBy('datetime').get();
//   ref.docs.map((doc) => {
//     const data = {
//       id: doc.id,
//       title: doc.data().title,
//       limit: doc.data().limit,
//       status: doc.data().status,
//     };
//     todos.push(data);

//   });

//   const todo = todos.find((to) => {
//        return to.id === params.id;
//       }) ;
    
//   // ページコンポーネントにpropsとしてに渡す
//   return {
//     props: {
//       todo
//     },
//   }
// }

