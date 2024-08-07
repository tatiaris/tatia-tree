import React from 'react';
import Head from 'next/head';

/**
 * Header component
 */
export const Header: React.FC = () => {
  return (
    <Head>
      <title>Tatia Family Tree</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <meta name="description" content=""></meta>
      <meta name="viewport" content="user-scalable=yes, initial-scale=1, maximum-scale=5, minimum-scale=1, width=device-width" />
      <meta property="og:title" content="Tatia Family Tree" />
      <meta property="og:site_name" content="Tatia Family Tree" />
      <meta property="og:url" content="" />
      <meta property="og:description" content="Tatia Family Tree" />
      <meta property="og:type" content="profile" />
      <meta httpEquiv="content-language" content="en" />
    </Head>
  );
};

export default Header;
