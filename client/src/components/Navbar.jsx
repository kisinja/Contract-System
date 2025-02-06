import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <div className="flex justify-center gap-8">
            <Link to="/">
                Home
            </Link>
            <Link to="/all-contracts">
                Contracts
            </Link>
            <Link to="/create-contract">
                Create a Contract
            </Link>
        </div>
    )
}

export default Navbar
