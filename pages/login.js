import "firebase/auth";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from "react";
import { auth } from "../firebase.js";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      user && Router.push("/");
    });
    return () => unSub();
  }, []);

  return (
    <>
      <Head>
        <title>TODO ログイン/新規登録(Next.js)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="font-mono">
        <div className="text-center">
          <div className="w-3/5 mx-auto py-14">
            <div className="shadow-xl">
              <div className="bg-blue-400 py-3 rounded-t">
                <h1 className="text-white font-bold text-3xl">
                  {isLogin ? "ログイン" : "新規登録"}
                </h1>
              </div>
              {/*  */}
              <div className="bg-white rounded-b">
                <div className="text-right p-3">
                  <button
                    className="text-xs text-blue-600 hover:text-blue-300"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin
                      ? "アカウントをお持ちでない方はこちら"
                      : "アカウントをお持ちの方はこちら"}
                  </button>
                </div>

                <div className="mt-5">
                  <label>
                    <span className="mr-1">メールアドバイス</span>
                    <input
                      autoFocus
                      className="bg-blue-100 mr-5 rounded"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>

                  <label>
                    <span className="mr-1">パスワード</span>
                    <input
                      className="bg-blue-100 placeholder-blue-300 pl-2 rounded"
                      name="password"
                      value={password}
                      placeholder="6文字以上"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                </div>

                <div>
                  <button
                    className="bg-blue-500 text-lg font-bold text-white rounded-full py-1 px-4 mt-7 shadow hover:bg-blue-400"
                    onClick={
                      isLogin
                        ? async () => {
                            try {
                              await auth.signInWithEmailAndPassword(
                                email,
                                password
                              );
                              alert("ログインしました");
                              Router.push("/");
                            } catch (error) {
                              alert("アカウントが見つかりませんでした");
                            }
                          }
                        : async () => {
                            try {
                              await auth.createUserWithEmailAndPassword(
                                email,
                                password
                              );
                              alert("アカウントを作成できました");
                              Router.push("/");
                            } catch (error) {
                              alert("エラー 正しい内容を入力してください");
                            }
                          }
                    }
                  >
                    {isLogin ? "ログインする" : "新規登録する"}
                  </button>
                </div>

                <div className="text-right">
                  <Link href="/">
                    <button className="text-xs p-2 hover:text-gray-300">
                      TODO一覧へ戻る
                    </button>
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
