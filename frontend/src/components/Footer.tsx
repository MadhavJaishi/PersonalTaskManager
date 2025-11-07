const Footer = () => {
    return (
        <footer className="bg-white text-zinc-700 font-bold text-sm fixed bottom-0 left-0 w-full pt-4">
            <div className=""></div>
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center cursor-pointer">
                <img src="../../public/applogo.png" height={90} width={70} alt="" />
                <div className="">
                    <p className="">&copy; {new Date().getFullYear()} - Ultimate Task Manager. All rights reserved.</p>
                </div>
                <div className="flex space-x-4 mt-2 sm:mt-0">
                    <a
                        href="mailto:madhavjaishi00@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-700 transition"
                    >
                        Contact
                    </a>

                    <a
                        href="https://github.com/MadhavJaishi/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-700 transition"
                    >
                        GitHub
                    </a>

                    <a
                        href="https://www.linkedin.com/in/MadhavJaishi/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-700 transition"
                    >
                        LinkedIn
                    </a>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
