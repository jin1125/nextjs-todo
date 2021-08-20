import "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { db } from "../../src/lib/firebase.js";
import firebase from "firebase/app";


export default function Create() {
  ////////ステートエリア////////
  const [title, setTitle] = useState("");
  const [limit, setLimit] = useState("");
  const [status, setStatus] = useState("未完了");

  ////////関数エリア////////
  const inputTitle = (e) => {
    setTitle(e.target.value);
  };

  const inputLimit = (e) => {
    setLimit(e.target.value);
  };

  const inputStatus = (e) => {
    setStatus(e.target.value);
  };

  const inputTodos = () => {
    const todoList = {
      title: title,
      limit: limit,
      status: status,
      datetime:firebase.firestore.Timestamp.now(),
    };

    
    db.collection('todos')
    .add(todoList)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
  })
  .catch((error) => {
      console.error("Error adding document: ", error);
  });

  console.log(todoList);
    
    setTitle("");
    setLimit("");
    
  };
  

  ////////描画エリア////////
  return (
    <>
      <Head>
        <title>TODOアプリ作成(Next.js)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
            onChange={inputTitle}
          />
        </label>
      </div>

      {/*  */}

      <div>
        <label>
          期限
          <input type="date" name="limit" value={limit} onChange={inputLimit} />
        </label>
      </div>

      {/*  */}
      <div>
        <label>
          進捗状況
          <select name="status" onChange={inputStatus}>
            <option defaultValue value="未完了">
              未完了
            </option>
            <option value="途中">途中</option>
            <option value="完了">完了</option>
          </select>
        </label>
      </div>
      {/*  */}

      <br />
      <button onClick={inputTodos}>TODO作成</button>

      <Link href="/todos">
        <button>TODO一覧へ戻る</button>
      </Link>
    </>
  );
}
