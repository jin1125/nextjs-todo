import "firebase/auth";
import Router from "next/router";
import { useEffect, useState } from "react";
import { auth } from "../src/lib/firebase.js";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
   const unSub =  auth.onAuthStateChanged((user) => {
      user && Router.push("/todos");
    });
    return ()=> unSub();
  }, []);


  return (
    <div>
      <h1>{isLogin ? "ログイン" : "新規登録"}</h1>
      <div>
        <button onClick={()=>setIsLogin(!isLogin)}>
          {isLogin
            ? "アカウントをお持ちでない方はこちら"
            : "アカウントをお持ちの方はこちら"}
        </button>
      </div>

      <label>
        メールアドバイス
        <input
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label>
        パスワード
        <input
          name="password"
          value={password}
          placeholder='6文字以上'
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button
        onClick={
          isLogin
            ? async () => {
                try {
                  await auth.signInWithEmailAndPassword(email, password);
                  alert('ログインしました');
                  Router.push("/todos");
                } catch (error) {
                  alert('アカウントが見つかりませんでした');
                }
              }
            : async () => {
                try {
                  await auth.createUserWithEmailAndPassword(email, password);
                  alert('アカウントを作成できました');
                  Router.push("/todos");
                } catch (error) {
                  alert('エラー 正しい内容を入力してください');
                }
              }
        }
      >
        {isLogin ? "ログインする" : "新規登録する"}
      </button>
    </div>
  );
}
