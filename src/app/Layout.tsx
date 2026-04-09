<<<<<<< HEAD
<<<<<<< HEAD
import { Link, Outlet, useLocation } from "react-router";
import { Search, MapPin, ChevronDown, User, Ticket, Settings } from "lucide-react";
import { CITIES, CATEGORIES } from "./data";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
=======
=======
>>>>>>> e91372e (initial commit)
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  CirclePlus,
  Search,
  MapPin,
  ChevronDown,
  User,
  Ticket,
  Settings,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CITIES, CATEGORIES } from "./data";
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
import { useAuth } from "./context/AuthContext";

export function Layout() {
  const [cityOpen, setCityOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
<<<<<<< HEAD
<<<<<<< HEAD
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedCat, setSelectedCat] = useState("All Events");
  const location = useLocation();
  const { isAuthenticated, isBootstrapping, signOut, user } = useAuth();

  const isAuthPage = location.pathname === "/signin" || location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-white/30 font-sans relative overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Logo */}
=======
=======
>>>>>>> e91372e (initial commit)
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchText, setSearchText] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isBootstrapping, signOut, user } = useAuth();

  const isAuthPage =
    location.pathname === "/signin" || location.pathname === "/signup";
  const selectedCategoryLabel =
    CATEGORIES.find((category) => category.id === selectedCat)?.name ?? "All Events";
  const selectedCityLabel = selectedCity === "All" ? "All Cities" : selectedCity;

  useEffect(() => {
    if (location.pathname !== "/explore") {
      return;
    }

    const params = new URLSearchParams(location.search);
    setSearchText(params.get("search") ?? "");
    setSelectedCity(params.get("city") ?? "All");
    setSelectedCat(params.get("categoryId") ?? "all");
  }, [location.pathname, location.search]);

  function openExplore(nextValues?: {
    search?: string;
    city?: string;
    categoryId?: string;
  }) {
    const nextSearch = nextValues?.search ?? searchText;
    const nextCity = nextValues?.city ?? selectedCity;
    const nextCategoryId = nextValues?.categoryId ?? selectedCat;
    const params = new URLSearchParams();

    if (nextSearch.trim()) {
      params.set("search", nextSearch.trim());
    }

    if (nextCity !== "All") {
      params.set("city", nextCity);
    }

    if (nextCategoryId !== "all") {
      params.set("categoryId", nextCategoryId);
    }

    setCityOpen(false);
    setCatOpen(false);

    navigate({
      pathname: "/explore",
      search: params.toString() ? `?${params.toString()}` : "",
    });
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    openExplore();
  }

  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-white/30 font-sans relative overflow-x-hidden">
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center transition-all group-hover:scale-105">
              <Ticket className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black tracking-widest text-white">
              EVENTIFY
            </span>
          </Link>

          {!isAuthPage && (
<<<<<<< HEAD
<<<<<<< HEAD
            <>
              {/* Search & Filters (Desktop) */}
              <div className="hidden lg:flex flex-1 max-w-2xl bg-white/5 border border-white/10 rounded-full items-center px-2 py-1.5 focus-within:border-white/50 focus-within:bg-white/10 transition-colors">
                
                {/* Search */}
                <div className="flex-1 flex items-center gap-2 px-3 border-r border-white/10">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search events, artists, venues..." 
                    className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-500"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="relative border-r border-white/10 px-3">
                  <button 
                    onClick={() => { setCatOpen(!catOpen); setCityOpen(false); }}
                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap"
                  >
                    <span className="truncate max-w-[100px]">{selectedCat}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  <AnimatePresence>
                    {catOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-4 w-48 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl py-2 z-50 max-h-64 overflow-y-auto"
                      >
                        {CATEGORIES.map(cat => (
                          <button 
                            key={cat.id}
                            onClick={() => { setSelectedCat(cat.name); setCatOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                          >
                            <span>{cat.icon}</span> {cat.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* City Selector */}
                <div className="relative px-3">
                  <button 
                    onClick={() => { setCityOpen(!cityOpen); setCatOpen(false); }}
                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap"
                  >
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="truncate max-w-[100px]">{selectedCity}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  <AnimatePresence>
                    {cityOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-4 w-56 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl py-2 z-50 max-h-80 overflow-y-auto"
                      >
                        <button 
                          onClick={() => { setSelectedCity("All Cities"); setCityOpen(false); }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 hover:text-white transition-colors font-medium"
                        >
                          All Cities
                        </button>
                        {CITIES.map(city => (
                          <button 
                            key={city}
                            onClick={() => { setSelectedCity(city); setCityOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 hover:text-white transition-colors"
                          >
                            {city}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </>
          )}

          {/* Auth & Map Links */}
=======
=======
>>>>>>> e91372e (initial commit)
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex flex-1 max-w-2xl bg-white/5 border border-white/10 rounded-full items-center px-2 py-1.5 focus-within:border-white/50 focus-within:bg-white/10 transition-colors"
            >
              <div className="flex-1 flex items-center gap-2 px-3 border-r border-white/10">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search events, artists, venues..."
                  className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-500"
                />
              </div>

              <div className="relative border-r border-white/10 px-3">
                <button
                  type="button"
                  onClick={() => {
                    setCatOpen(!catOpen);
                    setCityOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap"
                >
                  <span className="truncate max-w-[100px]">{selectedCategoryLabel}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {catOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-4 w-48 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl py-2 z-50 max-h-64 overflow-y-auto"
                    >
                      {CATEGORIES.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => {
                            setSelectedCat(category.id);
                            openExplore({ categoryId: category.id });
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                        >
                          <span>{category.icon}</span> {category.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative px-3">
                <button
                  type="button"
                  onClick={() => {
                    setCityOpen(!cityOpen);
                    setCatOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap"
                >
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="truncate max-w-[100px]">{selectedCityLabel}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {cityOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-4 w-56 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl py-2 z-50 max-h-80 overflow-y-auto"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCity("All");
                          openExplore({ city: "All" });
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 hover:text-white transition-colors font-medium"
                      >
                        All Cities
                      </button>
                      {CITIES.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => {
                            setSelectedCity(city);
                            openExplore({ city });
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 hover:text-white transition-colors"
                        >
                          {city}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          )}

<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
          <div className="flex items-center gap-4 shrink-0">
            {!isAuthPage && (
              <>
                {user?.role === "admin" && (
<<<<<<< HEAD
<<<<<<< HEAD
                  <Link to="/admin" className="hidden md:flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
                    <Settings className="w-4 h-4" /> Admin
                  </Link>
                )}
                <Link to="/explore" className="hidden sm:flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
=======
=======
>>>>>>> e91372e (initial commit)
                  <Link
                    to="/admin"
                    className="hidden md:flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                  >
                    <Settings className="w-4 h-4" /> Admin
                  </Link>
                )}
                <Link
                  to="/library"
                  className="hidden md:flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                >
                  <Ticket className="w-4 h-4" /> Library
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/my-events"
                    className="hidden md:flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                  >
                    <CirclePlus className="w-4 h-4" /> Add Event
                  </Link>
                )}
                <Link
                  to="/explore"
                  className="hidden sm:flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                >
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
                  <MapPin className="w-4 h-4" /> Map
                </Link>
              </>
            )}
<<<<<<< HEAD
<<<<<<< HEAD
            
            {isBootstrapping ? (
              <div className="h-10 w-24 rounded-full bg-white/10 animate-pulse" />
            ) : isAuthenticated && user ? (
              <button
                onClick={signOut}
                className="flex items-center gap-2 text-sm font-medium hover:text-white transition-colors bg-white text-black px-4 py-2 rounded-full"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user.name}</span>
              </button>
            ) : (
              <Link to="/signin" className="flex items-center gap-2 text-sm font-medium hover:text-white transition-colors bg-white text-black px-4 py-2 rounded-full">
                <User className="w-4 h-4" />
=======
=======
>>>>>>> e91372e (initial commit)

            {isBootstrapping ? (
              <div className="h-10 w-24 rounded-full bg-white/10 animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs font-black uppercase">
                    {user.name.slice(0, 2)}
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-slate-400 uppercase">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 text-sm font-medium transition-colors bg-white text-black px-4 py-2 rounded-full hover:bg-slate-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                className="flex items-center gap-2 text-sm font-medium hover:text-white transition-colors bg-white text-black px-4 py-2 rounded-full"
              >
                <User className="w-4 h-4" />
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

<<<<<<< HEAD
<<<<<<< HEAD
      {/* Main Content */}
=======
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
      <main className="relative z-10">
        <Outlet />
      </main>

<<<<<<< HEAD
<<<<<<< HEAD
      {/* Simple Footer */}
      {!isAuthPage && (
        <footer className="border-t border-white/10 mt-20 py-8 text-center text-slate-500 text-sm relative z-10 bg-black">
          <p>© 2026 EVENTIFY. All rights reserved.</p>
=======
      {!isAuthPage && (
        <footer className="border-t border-white/10 mt-20 py-8 text-center text-slate-500 text-sm relative z-10 bg-black">
          <p>&copy; 2026 EVENTIFY. All rights reserved.</p>
>>>>>>> e91372e (initial commit)
=======
      {!isAuthPage && (
        <footer className="border-t border-white/10 mt-20 py-8 text-center text-slate-500 text-sm relative z-10 bg-black">
          <p>&copy; 2026 EVENTIFY. All rights reserved.</p>
>>>>>>> e91372e (initial commit)
        </footer>
      )}
    </div>
  );
}
