import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
// import styles from '../styles/Home.module.css';
// import Layout from '../components/Layout';

const GENERATE_WALLET_EVENT = 'ZKOPRU#GENERATE_WALLET_KEY';

const Home: NextPage = () => {
    const [needWalletGeneration, setNeedWalletGeneration] = useState(false);
    const [providerAvailable, setProviderAvailable] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO:
        // check if L2 wallet is installed
        // check if L1 wallet is installed
        // check background status
        // if background status is not onboarded, display text to let user to open popup
        // and register password.
        // if background status is INITIALIZED, user don't need to do anything
        // if background status is NEED_WALLET_GENERATION, display button
    }, []);

    const handleClick = async () => {
        console.log('handle click');
        window.dispatchEvent(new Event(GENERATE_WALLET_EVENT));
    };

    return (
        <div className="container h-full">
            <Head>
                <title>ZKOPRU Extension Onboarding</title>
            </Head>

            <main className="w-full">
                <h1 className="text-5xl">
                    Transactions are private and cheap on ZKOPRU.
                </h1>

                <button className="p-4 bg-purple-500" onClick={handleClick}>
                    Connect and Sign
                </button>
            </main>
        </div>
    );
};

export default Home;
