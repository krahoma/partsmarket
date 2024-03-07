import 'bootstrap/dist/css/bootstrap.css';
import Header from '../components/header';
import buildClient from "../api/build-client";

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser} /> 
            <Component {...pageProps} />
        </div>
    );
};

AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/current').catch((err) => {
        console.log('Error:', err.message);
    });
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    return {
        pageProps,
        //currentUser: data.currentUser
        ...data
    };
};

export default AppComponent;