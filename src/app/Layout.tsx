import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  Bell,
  Bookmark,
  CalendarPlus,
  CheckCheck,
  ChevronDown,
  LogOut,
  MapPin,
  Moon,
  Search,
  Settings,
  Sun,
  Ticket,
  User,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { CITIES, CATEGORIES } from "./data";
import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "./context/AuthContext";
import { useNotifications } from "./context/NotificationsContext";

export function Layout() {
  const [cityOpen, setCityOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, signOut, user } = useAuth();
  const {
    notifications,
    unreadCount,
    markAllNotificationsRead,
    markNotificationRead,
    dismissNotification,
  } = useNotifications();

  const isAuthPage = location.pathname === "/signin" || location.pathname === "/signup";
  const selectedCategory = CATEGORIES.find((category) => category.id === selectedCat);
  const selectedCityLabel = selectedCity === "all" ? "All Cities" : selectedCity;

  useEffect(() => {
    if (location.pathname !== "/explore") {
      return;
    }

    const searchParams = new URLSearchParams(location.search);
    setSearchTerm(searchParams.get("search") ?? "");
    setSelectedCity(searchParams.get("city") ?? "all");
    setSelectedCat(searchParams.get("categoryId") ?? "all");
  }, [location.pathname, location.search]);

  useEffect(() => {
    setNotificationsOpen(false);
    setCityOpen(false);
    setCatOpen(false);
  }, [location.pathname, location.search]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    const trimmedSearch = searchTerm.trim();

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    }

    if (selectedCity !== "all") {
      params.set("city", selectedCity);
    }

    if (selectedCat !== "all") {
      params.set("categoryId", selectedCat);
    }

    navigate(`/explore${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-white/30 font-sans relative overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center transition-all group-hover:scale-105">
              <Ticket className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black tracking-widest text-white">
              EVENTIFY
            </span>
          </Link>

          {!isAuthPage && (
            <>
              {/* Search & Filters (Desktop) */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden lg:flex flex-1 max-w-2xl bg-white/5 border border-white/10 rounded-full items-center px-2 py-1.5 focus-within:border-white/50 focus-within:bg-white/10 transition-colors"
              >
                
                {/* Search */}
                <div className="flex-1 flex items-center gap-2 px-3 border-r border-white/10">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search events, artists, venues..." 
                    className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-500"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="relative border-r border-white/10 px-3">
                  <button 
                    type="button"
                    onClick={() => { setCatOpen(!catOpen); setCityOpen(false); }}
                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap"
                  >
                    <span className="truncate max-w-[100px]">
                      {selectedCategory?.name ?? "All Events"}
                    </span>
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
                            type="button"
                            onClick={() => { setSelectedCat(cat.id); setCatOpen(false); }}
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
                    type="button"
                    onClick={() => { setCityOpen(!cityOpen); setCatOpen(false); }}
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
                          onClick={() => { setSelectedCity("all"); setCityOpen(false); }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 hover:text-white transition-colors font-medium"
                        >
                          All Cities
                        </button>
                        {CITIES.map(city => (
                          <button 
                            key={city}
                            type="button"
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

              </form>
            </>
          )}

          {/* Auth & Map Links */}
          <div className="flex items-center gap-4 shrink-0">
            {!isAuthPage && (
              <>
                {isAuthenticated && (
                  <>
                    <Link to="/library" className="hidden md:flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
                      <Bookmark className="w-4 h-4" /> Library
                    </Link>
                    <Link to="/my-events" className="hidden md:flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
                      <CalendarPlus className="w-4 h-4" /> My Events
                    </Link>
                  </>
                )}
                {user?.role === "admin" && (
                  <Link to="/admin" className="hidden md:flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
                    <Settings className="w-4 h-4" /> Admin
                  </Link>
                )}
                <Link to="/explore" className="hidden sm:flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
                  <MapPin className="w-4 h-4" /> Map
                </Link>
              </>
            )}

            {!isAuthPage && <ThemeToggle />}
            
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen((currentValue) => !currentValue)}
                    className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Open notifications"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-black">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full z-50 mt-3 w-[22rem] overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur-xl"
                      >
                        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                          <div>
                            <p className="text-sm font-semibold text-white">Notifications</p>
                            <p className="text-xs text-slate-500">
                              {notifications.length === 0
                                ? "Nothing new right now."
                                : `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}`}
                            </p>
                          </div>
                          {notifications.length > 0 && (
                            <button
                              type="button"
                              onClick={markAllNotificationsRead}
                              className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                            >
                              <CheckCheck className="h-3.5 w-3.5" />
                              Mark all read
                            </button>
                          )}
                        </div>

                        <div className="max-h-96 overflow-y-auto px-3 py-3">
                          {notifications.length === 0 && (
                            <div className="rounded-[1.25rem] border border-dashed border-white/10 bg-black/25 px-4 py-8 text-center">
                              <Bell className="mx-auto h-8 w-8 text-slate-600" />
                              <p className="mt-3 text-sm font-medium text-white">
                                No notifications yet
                              </p>
                              <p className="mt-2 text-xs text-slate-500">
                                Booking, account, and event updates will show up here.
                              </p>
                            </div>
                          )}

                          <div className="space-y-2">
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`flex items-start gap-2 rounded-[1.25rem] border px-3 py-3 ${
                                  notification.readAt
                                    ? "border-white/5 bg-black/20"
                                    : "border-white/10 bg-white/[0.03]"
                                }`}
                              >
                                {notification.href ? (
                                  <Link
                                    to={notification.href}
                                    onClick={() => {
                                      markNotificationRead(notification.id);
                                      setNotificationsOpen(false);
                                    }}
                                    className="min-w-0 flex-1"
                                  >
                                    <p className="text-sm font-semibold text-white">
                                      {notification.title}
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                                      {notification.body}
                                    </p>
                                    <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                      {formatNotificationTime(notification.createdAt)}
                                    </p>
                                  </Link>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => markNotificationRead(notification.id)}
                                    className="min-w-0 flex-1 text-left"
                                  >
                                    <p className="text-sm font-semibold text-white">
                                      {notification.title}
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                                      {notification.body}
                                    </p>
                                    <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                      {formatNotificationTime(notification.createdAt)}
                                    </p>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => dismissNotification(notification.id)}
                                  className="rounded-full p-1 text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
                                  aria-label={`Dismiss ${notification.title}`}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={signOut}
                  className="flex items-center gap-2 text-sm font-medium hover:bg-slate-200 transition-colors bg-white text-black px-4 py-2 rounded-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <Link to="/signin" className="flex items-center gap-2 text-sm font-medium hover:bg-slate-200 transition-colors bg-white text-black px-4 py-2 rounded-full">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        <Outlet />
      </main>

      {/* Simple Footer */}
      {!isAuthPage && (
        <footer className="border-t border-white/10 mt-20 py-8 text-center text-slate-500 text-sm relative z-10 bg-black">
          <p>© 2026 EVENTIFY. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
}

function formatNotificationTime(createdAt: string) {
  return new Date(createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
