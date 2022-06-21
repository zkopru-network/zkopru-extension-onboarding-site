import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import fireFoxIcon from '../public/assets/firefox.svg';
import Image from 'next/image';
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
        <>
            <Head>
                <title>ZKOPRU Extension Onboarding</title>
            </Head>

            <main className="bg-gradient-to-b from-wlilac/25 to-wblue/25">
                <div className="p-4 pt-24 min-h-screen">
                    <div className="container mx-auto flex flex-col gap-6 items-center justify-center border-2 backdrop-blur-sm backdrop-opacity-25 bg-purple-50/10 p-16 rounded-3xl max-w-4xl">
                        <h1 className="text-5xl text-center leading-snug max-w-3xl text-wblue-dark">
                            Transactions are private and cheap on ZKOPRU.
                        </h1>

                        <button className="py-3 px-8 transition-all bg-gradient-to-br from-wblue hover:from-wlilac to-wlilac hover:to-wblue rounded-full text-white flex gap-x-4 justify-between items-center text-lg">
                            <Image
                                alt="Firefox Logo"
                                src={fireFoxIcon}
                                width={20}
                                height={20}
                            />
                            <p>Install wallet for Firefox</p>
                        </button>
                        <div className="grid grid-cols-8 gap-6 p-4 bg-gray-200/50 shadow-sm rounded-2xl">
                            <div className="flex items-center gap-8 col-span-5">
                                <p>💡</p>
                                <p className="text-gray-600 font-normal text-sm">
                                    After you install our addon, we&apos;ll need
                                    to connect to your MetaMask wallet to sync
                                    with ZKOPRU
                                </p>
                            </div>
                            <button
                                className="py-2 px-2 rounded-3xl text-white bg-wlilac/60 transition-colors hover:bg-wlilac col-span-3"
                                onClick={handleClick}
                            >
                                Connect Ethereum wallet
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Home;
