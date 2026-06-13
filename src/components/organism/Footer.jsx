function Footer({ padding }) {
    return (
        <section className={`${padding}py-8 px-5 md:px-20 md:py-0 lg:px-24`}>
            <section className="grid md:grid-cols-2 md:gap-x-2 lg:grid-cols-6">
                <div className="py-10 md:pt-8 lg:col-span-2 lg:w-80">
                    <img src="/src/assets/images/Tickitz 2.png" className="w-45" alt="" />
                    <p className="text-gray-500 text-normal">Stop waiting in line. Buy tickets
                        conveniently, watch movies quietly.</p>
                </div>

                <div>
                    <p className="font-bold py-5 md:pt-10">Explore</p>
                    <div className="flex flex-wrap gap-x-10 gap-y-2 text-gray-500 lg:flex-col">
                        <a href="">Cinemas</a>
                        <a href="">Movie List</a>
                        <a href="">Notification</a>
                        <a href="">My Ticket</a>
                    </div>
                </div>

                <div className="py-10 md:py-0 lg:pt-10 lg:mx-auto">
                    <p className="font-bold">Our Sponsor</p>
                    <div className="flex gap-5 pt-5 md:pt-3 items-end lg:grid">
                        <img className="h-8" src="/src/assets/images/ebv.id-black.svg" alt="" />
                        <img src="/src/assets/images/CineOne21 2.svg" alt="" />
                        <img src="/src/assets/images/hiflix 2.svg" alt="" />
                    </div>
                </div>

                <div className="lg:col-span-2 lg:pt-10 lg:m-auto">
                    <p className="font-bold">Follow us</p>
                    <div className="flex opacity-90 gap-8 py-5 lg:grid">
                        <div className="flex gap-2">
                            <img src="/src/assets/icons/eva_facebook-outline.svg" alt="" />
                            <p className="hidden font-semibold lg:block lg:text-gray-500">Tickitz Cinema Id</p>
                        </div>
                        <div className="flex gap-2">
                            <img src="/src/assets/icons/bx_bxl-instagram.svg" alt="" />
                            <p className="hidden font-semibold lg:block lg:text-gray-500">Tickitz.id</p>
                        </div>
                        <div className="flex gap-2">
                            <img className="" src="/src/assets/icons/eva_twitter-outline.svg" alt="" />
                            <p className="hidden font-semibold lg:block lg:text-gray-500">Tickitz.id</p>
                        </div>
                        <div className="flex gap-2">
                            <img src="/src/assets/icons/feather_youtube.svg" alt="" />
                            <p className="hidden font-semibold lg:block lg:text-gray-500">Tickitz Cinema Id</p>
                        </div>
                    </div>
                </div>
            </section>
            <p className="py-10 text-gray-500 md:text-center">© 2026 Tickitz. All Rights Reserved.</p>
        </section>
    )
}

export default Footer;