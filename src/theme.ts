// src/theme.ts
import { writable } from 'svelte/store';

// Tentukan nama tema Anda
const lightTheme = 'light'; // Harus cocok dengan nama di config Anda
const darkTheme = 'dark';  // Harus cocok dengan nama di config Anda

// Fungsi untuk membuat store yang persisten
function createThemeStore() {
  let initialTheme = lightTheme;

  // Cek localStorage hanya di sisi browser
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      initialTheme = storedTheme;
    } else {
      // Opsi: Cek preferensi sistem pengguna
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      initialTheme = prefersDark ? darkTheme : lightTheme;
    }
  }

  const theme = writable(initialTheme);

  // Fungsi untuk berlangganan perubahan store
  theme.subscribe((value) => {
    if (typeof window !== 'undefined') {
      // Simpan ke localStorage
      localStorage.setItem('theme', value);
      
      // Terapkan tema ke elemen <html>
      document.documentElement.setAttribute('data-theme', value);
    }
  });

  // Fungsi helper untuk mengganti tema
  const toggle = () => {
    theme.update((current) => (current === lightTheme ? darkTheme : lightTheme));
  };

  return {
    subscribe: theme.subscribe,
    toggle,
  };
}

export const themeStore = createThemeStore();