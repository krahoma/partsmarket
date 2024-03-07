import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
    console.log(currentUser);
    if(currentUser){
        return <h1>Home page <p>You {currentUser.email} are signed in</p></h1>
    }else{
        return <h1>Home page <p>You are not signed in</p></h1>
    }
};
LandingPage.getInitialProps = async (context) => {
    const client = buildClient(context);
    const { data } = await client.get('/api/users/current').catch((err) => {
        console.log('Error:', err.message);
    });
    return data;
};

export default LandingPage;