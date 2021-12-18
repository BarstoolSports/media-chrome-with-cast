import Head from 'next/head'
import Script from 'next/script'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import styles from '../styles/Home.module.css'

const Player = dynamic(import('../components/player'), { ssr: false });

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Media Chrome with Casting</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Player />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
