
const OrdersPage = ({ currentUser, orders }) => {
    const orderList = orders.map(order => {
        return <li key={order.id}>{order.part.title} - {order.status}</li>
    });
    return (<ul>{orderList}</ul>);
}

OrdersPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/orders');
    return { orders: data };
};

export default OrdersPage;