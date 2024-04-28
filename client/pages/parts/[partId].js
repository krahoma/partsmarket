import useRequest from '../../hooks/use-request'
import Router from 'next/router';
const PartShow = ({ part }) => {
    const { doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: { partId: part.id },
        onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
    });

    return (
        <div>
            <h1>{part.title}</h1>
            <h4>Price: {part.price}</h4>
            <h4>Quantity: {part.quantity}</h4>
            {errors}
            <button onClick={() => doRequest()} className="btn btn-primary">Purchase</button>
        </div>);
}

PartShow.getInitialProps = async (context, client) => {
    const { partId } = context.query;
    const { data } = await client.get(`/api/parts/${partId}`);
    return { part: data };
};

export default PartShow;