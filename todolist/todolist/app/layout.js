import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Layout = ({ children }) => {
  return (
    <div>
      <Head>
        <title>My Todo App</title>
        <meta name="description" content="A simple todo application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <nav>
          <ul>
            <li>
              <Link href="/register" legacyBehavior><a>Register</a></Link>
            </li>
            <li>
              <Link href="/login" legacyBehavior><a>Login</a></Link>
            </li>
            <li>
              <Link href="/task" legacyBehavior><a>Task</a></Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        {children}
      </main>
      <footer>
        <p>My Todo App © 2024</p>
      </footer>
    </div>
  );
};

export default Layout;
