import { Header } from '../components/common/Header';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import '../style.css';
import { useEffect, useState } from 'react';
import { getUserSession } from '../components/Helper';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      {/* <Navbar userSession={userSession} /> */}
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
