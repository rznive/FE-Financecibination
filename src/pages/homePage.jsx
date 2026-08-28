import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const featuresElement = document.getElementById("features");
      const aboutElement = document.getElementById("about");

      const featuresOffset = featuresElement ? featuresElement.offsetTop : 0;
      const aboutOffset = aboutElement ? aboutElement.offsetTop : 0;
      const scrollPosition = window.scrollY + 120; // Offset threshold for header height

      if (scrollPosition >= aboutOffset) {
        setActiveSection("about");
      } else if (scrollPosition >= featuresOffset) {
        setActiveSection("features");
      } else {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container font-body-lg">
      {/* TopNavBar Shared Component */}
      <header className="bg-surface dark:bg-background shadow-sm fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-surface-border">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center px-margin-desktop h-20">
          {/* Brand Logo */}
          <Link className="flex items-center space-x-3" to="/">
            <img
              src="/financecibination.png"
              alt="FinanceCibination Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="font-headline-lg text-headline-lg font-bold text-primary dark:text-on-primary-fixed">
              FinanceCibination
            </span>
          </Link>
          {/* Navigation Links (Web) */}
          <nav className="hidden md:flex space-x-8">
            <a
              className={`relative font-body-lg text-body-lg pb-1 transition-colors duration-300 group ${activeSection === "features" ? "text-secondary font-bold" : "text-on-surface-variant hover:text-secondary"
                }`}
              href="#features"
            >
              Fitur
              <span className={`absolute bottom-0 left-0 h-0.5 bg-secondary transition-all duration-300 ${activeSection === "features" ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
            </a>
            <a
              className={`relative font-body-lg text-body-lg pb-1 transition-colors duration-300 group ${activeSection === "about" ? "text-secondary font-bold" : "text-on-surface-variant hover:text-secondary"
                }`}
              href="#about"
            >
              Tentang Kami
              <span className={`absolute bottom-0 left-0 h-0.5 bg-secondary transition-all duration-300 ${activeSection === "about" ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
            </a>
          </nav>
          {/* Trailing Action */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="font-body-lg text-body-lg text-on-surface-variant hover:text-secondary transition-colors px-4 py-2 rounded-lg hover:bg-surface-container-low active:scale-95 duration-200">
              Masuk
            </Link>
            <Link to="/register" className="bg-primary-container text-on-primary-container font-body-lg text-body-lg px-6 py-2 rounded-lg hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-all active:scale-95 duration-200 shadow-[0_4px_20px_rgba(15,23,42,0.06)] hover:shadow-[0_8px_20px_rgba(15,23,42,0.10)]">
              Daftar
            </Link>
          </div>
          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-primary p-2 focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-surface border-t border-surface-border px-margin-mobile py-4 space-y-4">
            <nav className="flex flex-col space-y-3">
              <a
                className="font-body-lg text-body-lg text-on-surface-variant hover:text-secondary py-2 border-b border-surface-border"
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fitur
              </a>
              <a
                className="font-body-lg text-body-lg text-on-surface-variant hover:text-secondary py-2 border-b border-surface-border"
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tentang Kami
              </a>
            </nav>
            <div className="flex flex-col space-y-2 pt-2">
              <Link
                to="/login"
                className="w-full text-center font-body-lg text-body-lg text-on-surface-variant hover:text-secondary py-2 rounded-lg hover:bg-surface-container-low"
                onClick={() => setMobileMenuOpen(false)}
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="w-full text-center bg-primary-container text-on-primary-container font-body-lg text-body-lg py-2.5 rounded-lg hover:bg-surface-container-low transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Daftar
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24 grid md:grid-cols-12 gap-8 items-center md:gap-12">
          <div className="md:col-span-6 space-y-6">
            <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
              Kuasai Uang Anda, Kuasai Hidup Anda
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
              Kelola keuangan Anda dengan lebih mudah, mulai dari pemasukan, pengeluaran, hingga tujuan finansial dalam satu tempat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register" className="bg-secondary-container text-on-secondary-container font-title-md text-title-md px-8 py-3 rounded-lg hover:shadow-[0_8px_20px_rgba(15,23,42,0.10)] transition-all shadow-[0_4px_20px_rgba(15,23,42,0.06)] text-center active:scale-95 duration-200">
                Daftar Akun
              </Link>
              <Link to="/login" className="border border-outline text-on-surface font-title-md text-title-md px-8 py-3 rounded-lg hover:bg-surface-container-low transition-all active:scale-95 duration-200 text-center">
                Masuk ke Akun
              </Link>
            </div>
          </div>
          <div className="md:col-span-6 relative">
            {/* Abstract Hero Graphic instead of generic image */}
            <div className="w-full h-80 bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(15,23,42,0.06)] p-6 relative overflow-hidden border border-surface-border">
              {/* Faux UI Elements */}
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-surface-border pb-4">
                  <div>
                    <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">TOTAL SALDO</p>
                    <p className="font-headline-lg text-headline-lg text-primary mt-1">Rp 124.500.000</p>
                  </div>
                  <div className="flex items-center text-success-emerald font-numeric-data text-numeric-data bg-success-emerald/10 px-2 py-1 rounded">
                    <span className="material-symbols-outlined text-sm mr-1">trending_up</span> +12.4%
                  </div>
                </div>
                {/* Simple bar chart representation */}
                <div className="h-32 flex items-end justify-between space-x-2 pt-4">
                  <div className="w-1/6 bg-primary-fixed-dim h-1/3 rounded-t-sm"></div>
                  <div className="w-1/6 bg-primary-fixed-dim h-1/2 rounded-t-sm"></div>
                  <div className="w-1/6 bg-primary-fixed-dim h-2/3 rounded-t-sm"></div>
                  <div className="w-1/6 bg-secondary-container h-full rounded-t-sm"></div>
                  <div className="w-1/6 bg-primary-fixed-dim h-3/4 rounded-t-sm"></div>
                  <div className="w-1/6 bg-primary-fixed-dim h-1/2 rounded-t-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section id="features" className="bg-surface-container-lowest py-20 border-y border-surface-border">
          <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {/* Card 1 */}
              <div className="p-6 bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(15,23,42,0.06)] border border-surface-border hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(15,23,42,0.10)] transition-all duration-300">
                <div className="w-12 h-12 bg-secondary-container/10 rounded-md flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-secondary-container text-2xl">sync</span>
                </div>

                <h3 className="font-title-md text-title-md text-primary mb-3">
                  Pantau Keuangan
                </h3>

                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Catat dan pantau pemasukan serta pengeluaran Anda dengan lebih mudah dalam satu tempat.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-6 bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(15,23,42,0.06)] border border-surface-border hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(15,23,42,0.10)] transition-all duration-300">
                <div className="w-12 h-12 bg-secondary-container/10 rounded-md flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-secondary-container text-2xl">account_balance_wallet</span>
                </div>

                <h3 className="font-title-md text-title-md text-primary mb-3">
                  Atur Pengeluaran
                </h3>

                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Kelola pengeluaran sesuai kebutuhan agar keuangan Anda tetap lebih teratur dan terkendali.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-6 bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(15,23,42,0.06)] border border-surface-border hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(15,23,42,0.10)] transition-all duration-300">
                <div className="w-12 h-12 bg-secondary-container/10 rounded-md flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-secondary-container text-2xl">insights</span>
                </div>

                <h3 className="font-title-md text-title-md text-primary mb-3">
                  Lihat Perkembangan
                </h3>

                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Lihat ringkasan dan perkembangan keuangan Anda untuk membantu memahami kondisi keuangan dengan lebih baik.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* App Preview */}
        <section id="about" className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-20 text-center">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Kelola Keuangan Anda dengan Lebih Baik</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-2xl mx-auto">
            Kelola dan pantau keuangan Anda dalam tampilan yang bersih, sederhana, dan mudah dipahami.
          </p>
          <div className="relative mx-auto rounded-xl shadow-[0_8px_30px_rgba(15,23,42,0.15)] overflow-hidden border border-surface-border">
            <img
              alt="FinanceCibination Dashboard Preview"
              className="w-full h-auto object-cover"
              src="/screen.png"
            />
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-24 text-center">
          <div className="bg-primary-container rounded-2xl p-12 md:p-20 shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
            <h2 className="font-headline-lg text-headline-lg text-white mb-6">
              Saatnya mulai mengatur keuangan dengan lebih mudah.
            </h2>
            <p className="font-body-lg text-body-lg text-surface-tint mb-8 max-w-xl mx-auto">
              Bersama FinanceCibination, kelola keuangan dan pantau perkembangan finansial Anda dengan lebih mudah
            </p>
            <Link to="/register" className="inline-block bg-secondary-container text-on-secondary-container font-title-md text-title-md px-10 py-4 rounded-lg hover:shadow-[0_8px_20px_rgba(15,23,42,0.15)] transition-all transform hover:-translate-y-1">
              Buat Akun
            </Link>
          </div>
        </section>
      </main>

      {/* Footer Shared Component */}
      <footer className="bg-surface-container-lowest dark:bg-surface-container-high w-full border-t border-outline-variant transition-all duration-300">
        <div className="max-w-[1280px] mx-auto px-margin-desktop py-12 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center space-x-3">
            <img
              src="/financecibination.png"
              alt="FinanceCibination Logo"
              className="h-6 w-6 object-contain"
            />
            <span className="font-title-md text-title-md font-semibold text-primary">
              FinanceCibination
            </span>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors hover:underline" href="#">Kebijakan Privasi</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors hover:underline" href="#">Syarat &amp; Ketentuan</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors hover:underline" href="#">Kontak</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors hover:underline" href="#">Bantuan</a>
          </nav>
          <div className="font-body-sm text-body-sm text-on-surface dark:text-on-surface-variant">
            © 2026 FinanceCibination. Seluruh hak cipta dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
