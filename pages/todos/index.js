import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Head>
        <title>TODOアプリ(Next.js)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

    <Link href='/todos/create'>
    <button>TODO作成</button>
    </Link>
    </div>
  )
}
