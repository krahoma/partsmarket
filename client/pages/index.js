import Link from "next/link";

const LandingPage = ({ currentUser, parts }) => {
    console.log(parts);
    const partList = parts.map(part => {
        return (
        <tr key={part.id}>
            <td>{part.title}</td>
            <td>{part.price}</td>
            <td>{part.quantity}</td>
            <td><Link href="/parts/[partId]" as={`/parts/${part.id}`}> View</Link></td>
        </tr>);
    });

    return (
    <div>
        <h1>Parts</h1>
        <table className="table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Info</th>
                </tr>
            </thead>
            <tbody>
               {partList}
            </tbody>
        </table>
    </div>);

    // if (currentUser) {
    //     return <h1>Home page <p>You {currentUser.email} are signed in</p></h1>
    // } else {
    //     return <h1>Home page <p>You are not signed in !</p></h1>
    // }
};
LandingPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/parts');
    return { parts: data };
};

export default LandingPage;