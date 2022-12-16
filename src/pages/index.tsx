import MainPageContent from "components/MainPageContent";
import type { NextPage } from "next";
import Head from "next/head";
import "antd/dist/reset.css";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Eden Examples</title>
        <meta name="description" content="Examples for using Eden.art" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainPageContent />
    </div>
  );
};

export default Home;
