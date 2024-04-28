
import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimerLeft] = useState(0);

    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id,
        },
        onSuccess: () => Router.push('/orders'),
    });


    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimerLeft(Math.round(msLeft / 1000));
        };
        setTimerLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, [order]);
    if (timeLeft < 0) {
        return (<div>Sorry, time is up for order purchase</div>)
    }

    return (
        <div>Time left to pay : {timeLeft} seconds
            <StripeCheckout
                token={({ id }) => doRequest({ token: id })}
                stripeKey="pk_test_51NBznBHJ0LCJ1kDT2FHXkIKGViAVy81rTed5fm3TwqgAXS36cwjUzonQenHAeAHLD5G3xx6oXdCFdqOB6Oo09wEs00Fkip2jnm"
                amount={order.part.price * order.part.quantity * 100}
                email={currentUser.email}

            />
            {errors}
        </div>);
}
OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    console.log(data);
    return { order: data };
};

export default OrderShow;