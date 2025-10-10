import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Cart from './Cart';
import LoginPopup from './LoginPopup';
import Logo from '../assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { user, signOut } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  // Show login prompt popup occasionally for non-authenticated users
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        const hasSeenPrompt = localStorage.getItem('loginPromptSeen');
        if (!hasSeenPrompt) {
          setShowLoginPrompt(true);
          localStorage.setItem('loginPromptSeen', 'true');
        }
      }, 10000); // Show after 10 seconds

      return () => clearTimeout(timer);
    }
  }, [user]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'Team', href: '/team' },
    { name: 'Contact', href: '/contact' },
    ...(user ? [{ name: 'Admin', href: '/admin/products' }] : []),
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (href: string) => {
    navigate(href);
    scrollToTop();
    setIsMenuOpen(false);
  };

  const goToProducts = () => handleNavigate('/products');

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50 font-sans">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center" onClick={() => handleNavigate('/')}>
                <img src={Logo} alt="CERA Medical Logo" className="h-12 w-auto" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.href)}
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium font-sans"
                >
                  {item.name}
                </button>
              ))}
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
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    className="block px-3 py-2 text-foreground hover:text-primary transition-colors duration-200 font-medium w-full text-left"
                    onClick={() => handleNavigate(item.href)}
                  >
                    {item.name}
                  </button>
                ))}

                <div className="pt-4 pb-2 px-3 space-y-2">
                  <Cart>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Cart ({getTotalItems()})
                    </Button>
                  </Cart>

                  <Button className="btn-medical w-full" onClick={goToProducts}>
                    Shop Products
                  </Button>

                  {user ? (
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setLoginPopupOpen(true)}>
                      Login
                    </Button>
                  )}
                </div>
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
