import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "../../src/lib/firebase";

export default function Home( { todos } ) {

  ////// Reactバージョン //////
  // const [todos, setTodos] = useState([
  //   { id: "", title: "", limit: "", status: "" },
  // ]);

  // useEffect(() => {
  //   const lists = db.collection("todos").orderBy('datetime').onSnapshot((snapshot) => {
  //     setTodos(
  //       snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         title: doc.data().title,
  //         limit: doc.data().limit,
  //         status: doc.data().status,
  //       }))
  //     );
  //   });

  //   return () => lists();
  // }, []);

  return (
    <div>
      <Head>
        <title>TODOアプリ(Next.js)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h1>TODO一覧</h1>
        {todos.map((todo) => (
          <div key={todo.id}>
            <h3>{todo.title}</h3>
            <p>{todo.limit}</p>
            <p>{todo.status}</p>
            <button>詳細</button>
          </div>
        ))}
      </div>

      <Link href="/todos/create">
        <button>TODO作成</button>
      </Link>
    </div>
  );
}


export async function getServerSideProps() {
  const todos = [];
  const ref = await db.collection('todos').orderBy('datetime').get();
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
