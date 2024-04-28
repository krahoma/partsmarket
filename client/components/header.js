import Link from 'next/link'
export default ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/singup' },
        !currentUser && { label: 'Sign In', href: '/auth/singin' },
        currentUser && { label: 'Sell Parts', href: '/parts/add' },
        currentUser && { label: 'My Orders', href: '/orders' },
        currentUser && { label: 'Sign Out', href: '/auth/singout' }
    ].filter(link => link).map(({ label, href }) => {
        return (
            <li key={href} className="nav-item">
                <Link className='nav-link' href={href}>
                    {label}
                </Link>
            </li>)
    });
    return (
        <nav className="navbar navber-light bg-light">
            <Link className="navbar-brand" href="/">
                Parts Market
            </Link>
            <div className="d-flex justify-content-end">
                <ul className='nav d-flex align-items-center'>
                    {links}
                </ul>
            </div>
        </nav>
    );
};