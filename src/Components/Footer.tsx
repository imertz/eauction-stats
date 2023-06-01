const Footer = (props: { links: { name: string; link: string }[] }) => {
  return (
    <footer className="transparent">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav
          className="-mx-5 -my-2 flex flex-wrap justify-center"
          aria-label="Footer"
        >
          {props.links.map((link) => (
            <div key={link.name} className="px-5 py-2">
              <a
                href={link.link}
                className="text-base text-gray-100 hover:text-gray-900 underline"
              >
                {link.name}
              </a>
            </div>
          ))}
        </nav>
        <p className="mt-8 text-center text-base text-gray-200">
          &copy; 2023 eauctionstats.mysolon.gr
        </p>
      </div>
    </footer>
  );
};

export default Footer;
