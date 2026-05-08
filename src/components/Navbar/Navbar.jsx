export default function Navbar({ onLogout }) {
    return (
        <nav className="bg-[#C2A56D] to-pink-500 text-white px-8 py-5">
            <ul className="flex justify-between items-center">
                
                <div className="flex gap-10">
                    <li><a href="/">Home</a></li>
                    <li><a href="/customers">Customers</a></li>
                </div>

                <li>
                    <button 
                        onClick={onLogout} 
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                </li>

            </ul>
        </nav>
    );
}