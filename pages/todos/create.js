import firebase from "firebase/app";
import "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "../../src/lib/firebase.js";
import Router from "next/router";

export default function Create() {
  ////////ステートエリア////////
  const [title, setTitle] = useState("");
  const [limit, setLimit] = useState("");
  const [status, setStatus] = useState("");

  ////////関数エリア////////
  useEffect(() => {
    const unSub =  auth.onAuthStateChanged((user) => {
       !user && Router.push("/todos");
     });
     return ()=> unSub();
   }, []);


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
    const todo = {
      title: title,
      limit: limit,
      status: status,
      datetime: firebase.firestore.Timestamp.now(),
    };

    db.collection("todos")
      .add(todo)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        alert("TODOが作成できました");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        alert("TODO作成に失敗しました");
      });

    setTitle("");
    setLimit("");
  };

  const check = title === "" || limit === "" || status === "";

  ////////描画エリア////////
  return (
    <>
      <Head>
        <title>TODO作成(Next.js)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>TODO作成</h1>

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
      <button onClick={inputTodos} disabled={false}>
        TODOを作成する
      </button>

      <Link href="/todos">
        <button>TODO一覧へ戻る</button>
      </Link>
    </>
  );
}
