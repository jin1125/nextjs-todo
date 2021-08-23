import firebase from "firebase/app";
import "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase.js";

export default function Create() {
  ////////ステートエリア////////
  const [title, setTitle] = useState("");
  const [limit, setLimit] = useState("");
  const [status, setStatus] = useState("");

  ////////関数エリア////////
  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      !user && Router.push("/");
    });
    return () => unSub();
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

      <main className="font-mono">
        <div className="text-center">
          <div className="w-3/5 mx-auto py-14">
            <div className="shadow-xl">
              <div className="bg-blue-400 py-3 rounded-t">
                <h1 className="text-white font-bold text-3xl">TODO作成</h1>
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
                        onChange={inputTitle}
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
                        onChange={inputLimit}
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
                        onChange={inputStatus}
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
                    onClick={inputTodos}
                    className="bg-blue-500 text-lg font-bold text-white rounded-full py-1 px-4 mt-5 shadow hover:bg-blue-400 disabled:opacity-50"
                    disabled={check}
                  >
                    TODOを作成する
                  </button>
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
