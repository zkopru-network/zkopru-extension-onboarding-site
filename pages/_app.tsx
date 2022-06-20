import 'tailwindcss/tailwind.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <link rel="icon" href="./favicon.ico" />
                <meta name="msapplication-TileColor" content="#405AE0" />
                <meta name="theme-color" content="#405AE0" />
                <meta name="viewport" content="viewport-fit=cover" />
                <meta
                    name="description"
                    content="The onboarding page for the ZKOPRU extension"
                />
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
