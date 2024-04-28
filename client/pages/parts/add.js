import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from 'next/router';

const NewPart = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');

    const { doRequest, errors } = useRequest({
        url: "/api/parts",
        method: 'post',
        body: {
            title,
            price,
            quantity
        },
        onSuccess: () => Router.push('/'),

    })

    const onBlurPrice = () => {
        const value = parseFloat(price);
        if (isNaN(value))
            return;
        setPrice(value.toFixed(2));
    }
    const onBlurQuantity = () => {
        const value = parseInt(quantity);
        if (isNaN(value))
            return;
        setQuantity(value);
    }
    const onSubmit = (event) => {
        event.preventDefault();
        doRequest();
    }
    return (
        <div>
            <h1>Add new Part</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Description</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input value={price} onChange={(e) => setPrice(e.target.value)} onBlur={onBlurPrice} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Quantity</label>
                    <input value={quantity} onChange={(e) => setQuantity(e.target.value)} onBlur={onBlurQuantity} className="form-control" />
                </div>
                {errors}
                <button className="btn btn-primary">Add</button>
            </form>
        </div>);
}
export default NewPart;