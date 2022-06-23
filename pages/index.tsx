import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import fireFoxIcon from '../public/assets/firefox.svg';
import abstractBg from '../public/assets/desktop-bg.png';
import Image from 'next/image';

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

            <main className="bg-[url('/assets/desktop-bg.png')] bg-cover bg-center">
                <div className="p-4 pt-16 min-h-screen">
                    <div className="container mx-auto flex flex-col gap-8 p-16 rounded-3xl max-w-4xl">
                        <h1 className="text-6xl text-center leading-snug max-w-3xl text-white">
                            Transactions are private and cheap on ZKOPRU.
                        </h1>

                        <div className="flex flex-col items-center gap-3">
                            <button className="py-3 px-8 hover:-translate-y-2 outline-none focus:outline-2 focus:outline-white/60 outline-offset-4 transition bg-gradient-to-br from-wblue to-wlilac rounded-full text-white flex gap-x-4 justify-between items-center text-lg">
                                <Image
                                    alt="Firefox Logo"
                                    src={fireFoxIcon}
                                    width={20}
                                    height={20}
                                />
                                <p>Install wallet addon</p>
                            </button>
                            <p className="text-sm font-light text-white tracking-wide">
                                Available only on Firefox, for now 😉
                            </p>
                        </div>
                        <div className="grid grid-cols-8 gap-6 p-4 border-wlilac border-2 rounded-2xl bg-black/20">
                            <div className="flex items-center gap-8 col-span-5">
                                <p className="filter drop-shadow-lg">💡</p>
                                <p className="text-gray-200 font-normal text-sm">
                                    After you install our addon, we&apos;ll need
                                    to connect to your MetaMask wallet to sync
                                    with ZKOPRU
                                </p>
                            </div>
                            <button
                                className="py-1 px-2 rounded-full text-white bg-white/10 transition hover:bg-wlilac col-span-3"
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
