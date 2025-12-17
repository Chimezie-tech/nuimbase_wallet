import { ref, onMounted } from 'vue';

const isDark = ref(false);

export function useTheme() {

  // 1. Initialize (Check LocalStorage or System Preference)
  const initTheme = () => {
    const savedTheme = localStorage.getItem('user-theme');

    // Check saved preference or system preference
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark();
    } else {
      setLight();
    }
  };

  // 2. Turn Dark Mode ON
  const setDark = () => {
    isDark.value = true;
    document.documentElement.classList.add('dark'); // For PrimeVue & Tailwind
    document.documentElement.setAttribute('data-bs-theme', 'dark'); // For Bootstrap 5.3+
    localStorage.setItem('user-theme', 'dark');
  };

  // 3. Turn Dark Mode OFF
  const setLight = () => {
    isDark.value = false;
    document.documentElement.classList.remove('dark'); // For PrimeVue & Tailwind
    document.documentElement.setAttribute('data-bs-theme', 'light'); // For Bootstrap 5.3+
    localStorage.setItem('user-theme', 'light');
  };

  // 4. Toggle Function
  const toggleTheme = () => {
    if (isDark.value) {
      setLight();
    } else {
      setDark();
    }
  };

  return { isDark, toggleTheme, initTheme };
}
