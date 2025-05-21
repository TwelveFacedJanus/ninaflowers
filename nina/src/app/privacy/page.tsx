import React from 'react';

export default function PrivacyPage() {
  return (
    <div style={{
      maxWidth: 700,
      margin: '0 auto',
      padding: '48px 16px 64px 16px',
      color: '#186697',
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 4px 32px rgba(24,102,151,0.08)',
      marginTop: 48,
      marginBottom: 48,
      fontSize: '1.08rem',
      lineHeight: 1.7,
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 24, color: '#186697' }}>Политика конфиденциальности</h1>
      <p>Мы уважаем вашу конфиденциальность и заботимся о защите ваших персональных данных.</p>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: 32 }}>1. Какие данные мы собираем</h2>
      <ul style={{ marginLeft: 24, marginBottom: 16 }}>
        <li>Контактные данные (имя, телефон, email — если вы их оставляете при заказе или обращении)</li>
        <li>Техническая информация (IP-адрес, cookies, данные о браузере и устройстве)</li>
      </ul>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: 32 }}>2. Для чего используются данные</h2>
      <ul style={{ marginLeft: 24, marginBottom: 16 }}>
        <li>Для обработки и доставки ваших заказов</li>
        <li>Для связи с вами по вопросам заказа</li>
        <li>Для улучшения работы сайта и анализа посещаемости</li>
      </ul>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: 32 }}>3. Кто имеет доступ к данным</h2>
      <ul style={{ marginLeft: 24, marginBottom: 16 }}>
        <li>Только сотрудники Nina Flowers, отвечающие за обработку заказов</li>
        <li>Данные не передаются третьим лицам, кроме случаев, предусмотренных законом</li>
      </ul>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: 32 }}>4. Использование файлов cookie</h2>
      <p>Мы используем cookie для корректной работы сайта и анализа посещаемости. Вы можете отключить cookie в настройках браузера.</p>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: 32 }}>5. Связь по вопросам конфиденциальности</h2>
      <p>Если у вас есть вопросы по обработке персональных данных, напишите нам на <a href="mailto:twofaced-janus@yandex.ru" style={{ color: '#186697', textDecoration: 'underline' }}>twofaced-janus@yandex.ru</a>.</p>
      <p style={{ marginTop: 40, color: '#a0aec0', fontSize: '0.98em' }}>Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
    </div>
  );
} 