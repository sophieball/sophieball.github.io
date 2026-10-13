document.querySelectorAll('[data-set-lang]').forEach((button) => {
  button.addEventListener('click', () => {
    const language = button.dataset.setLang;
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-lang]').forEach((element) => {
      element.hidden = element.dataset.lang !== language;
    });
    document.querySelectorAll('[data-set-lang]').forEach((item) => {
      item.classList.toggle('active', item === button);
    });
  });
});
