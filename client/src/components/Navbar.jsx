import  { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";


const Navbar = () => {

     const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


     const userLinks = [
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "Job Applications", link: "/job-applications" }
  ];

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
             <p>
                TARGET AIMS
             </p>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
           {
              userLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.link}
                  className="text-blue-600   px-3 py-2 rounded-md text-lg font-medium transition duration-150 ease-in-out"
                >
                  {link.name}
                </Link>
              ))}
           
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-4">
         

            
              
        
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-black"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden ">
          <div className="space-y-1">
           {
              userLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.link}
                  className="block px-4 py-3 text-blue-600 text-center"
                  onClick={toggleMenu}
                >
                  {link.name}
                </Link>
              ))}
        


         
     
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar