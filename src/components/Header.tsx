import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import Cart from "./Cart";
import LoginPopup from "./LoginPopup";
import Logo from "../assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [scrollToId, setScrollToId] = useState<string | null>(null);

  const { user, signOut } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        const hasSeenPrompt = localStorage.getItem("loginPromptSeen");
        if (!hasSeenPrompt) {
          setShowLoginPrompt(true);
          localStorage.setItem("loginPromptSeen", "true");
        }
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    if (scrollToId && location.pathname === "/") {
      const el = document.getElementById(scrollToId);
      if (el) {
        const yOffset = -80; // navbar offset
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
      setScrollToId(null);
    }
  }, [location, scrollToId]);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", id: "about" },
    { name: "Products", href: "/products" },
    { name: "Services", id: "services" },
    { name: "Blog", href: "/blog" },
    { name: "Team", id: "team" },
    { name: "Contact", id: "contact" },
    ...(user ? [{ name: "Admin", href: "/admin/products" }] : []),
  ];

  const handleScroll = (id: string) => {
    if (location.pathname !== "/") {
      setScrollToId(id);
      navigate("/");
    } else {
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  const goToProducts = () => {
    navigate("/products");
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img src={Logo} alt="CERA Medical Logo" className="h-11 w-auto" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) =>
                item.id ? (
                  <button
                    key={item.name}
                    className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                    onClick={() => handleScroll(item.id!)}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </Link>
                )
              )}
            </nav>

            {/* Cart & Shop Button */}
            <div className="hidden md:flex items-center space-x-4">
              <Cart>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </Cart>

              <Button className="btn-medical" onClick={goToProducts}>
                Shop Products
              </Button>

              {user ? (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleSignOut}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setLoginPopupOpen(true)}>
                  Login
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
                {navigation.map((item) =>
                  item.id ? (
                    <button
                      key={item.name}
                      className="block px-3 py-2 text-foreground hover:text-primary transition-colors duration-200 font-medium"
                      onClick={() => handleScroll(item.id!)}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-3 py-2 text-foreground hover:text-primary transition-colors duration-200 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <LoginPopup
        open={loginPopupOpen || showLoginPrompt}
        onOpenChange={(open) => {
          setLoginPopupOpen(open);
          setShowLoginPrompt(false);
        }}
      />
    </>
  );
};

export default Header;
