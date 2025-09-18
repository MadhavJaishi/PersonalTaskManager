const Footer = () => {
    return (
        <footer className="bg-white text-zinc-700 font-bold text-sm fixed bottom-0 left-0 w-full py-4">
            <div className=""></div>
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center cursor-pointer">
                <p className="  ">&copy; {new Date().getFullYear()} ClearTrack - Ultimate Task Manager. All rights reserved.</p>
                <div className="flex space-x-4 mt-2 sm:mt-0">
                    <a href="#" className="hover:text-purple-700 transition">Privacy</a>
                    <a href="#" className="hover:text-purple-700 transition">Terms</a>
                    <a href="#" className="hover:text-purple-700 transition">Contact</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
