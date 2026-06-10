#!/usr/bin/env node

import fs from 'fs';

const COMPONENT_PATH = './src/pages/ISCardsPage.tsx';
const TRANSLATIONS_PATH = './src/locales/translations.ts';

// ВСЕ ХАРДКОДНЫЕ ТЕКСТОВЫЕ СТРОКИ
const TEXTS = {
  'Refresh': { ru: 'Обновить', pl: 'Odśwież' },
  'Open Cards': { ru: 'Открыть карты', pl: 'Otwórz karty' },
  'All': { ru: 'Все', pl: 'Wszystkie' },
  'Select all': { ru: 'Выбрать все', pl: 'Zaznacz wszystkie' },
  'Deselect all': { ru: 'Снять выбор', pl: 'Odznacz wszystkie' },
  'selected:': { ru: 'выбрано:', pl: 'zaznaczonych:' },
  'Assign to Device': { ru: 'Назначить устройство', pl: 'Przypisz do urządzenia' },
  'Clear': { ru: 'Очистить', pl: 'Wyczyść' },
  'cards': { ru: 'карт', pl: 'kart' },
  'Load more': { ru: 'Загрузить ещё', pl: 'Załaduj więcej' },
  'Client info': { ru: 'Данные клиента', pl: 'Dane klienta' },
  'Edit': { ru: 'Редактировать', pl: 'Edytuj' },
  'Add': { ru: 'Добавить', pl: 'Dodaj' },
  'No client info yet — click Add to fill in name, phone, or notes': { ru: 'Нет данных клиента — нажмите Добавить, чтобы заполнить имя, телефон или заметки', pl: 'Brak danych klienta — kliknij Dodaj, aby wpisać imię, telefon lub notatki' },
  'Saved': { ru: 'Сохранено', pl: 'Zapisano' },
  'Client name': { ru: 'Имя клиента', pl: 'Imię klienta' },
  'Cancel': { ru: 'Отмена', pl: 'Anuluj' },
  'Save': { ru: 'Сохранить', pl: 'Zapisz' },
  'Assigned to devices': { ru: 'Назначено устройств', pl: 'Przypisane urządzenia' },
  'No device restrictions — works on all devices': { ru: 'Нет ограничений по устройствам — работает на всех устройствах', pl: 'Brak ograniczeń urządzeń — działa na wszystkich urządzeniach' },
  'Open Cards': { ru: 'Открыть карты', pl: 'Otwórz karty' },
  'Card Details': { ru: 'Детали карты', pl: 'Szczegóły karty' },
  'Remote Swipe (Notify Device)': { ru: 'Удалённое считывание (уведомить устройство)', pl: 'Zdalne odczytanie (powiadomienie urządzenia)' },
  'How it works': { ru: 'Как это работает', pl: 'Jak to działa' },
  'Sends the card balance to the device — equivalent to physically swiping the card.': { ru: 'Отправляет баланс карты на устройство, что эквивалентно физическому считыванию карты.', pl: 'Wysyła saldo karty do urządzenia, co jest równoważne fizycznemu przyłożeniu karty.' },
  'Card active on device': { ru: 'Карта активна на устройстве', pl: 'Karta aktywna na urządzeniu' },
  'Stop dispensing': { ru: 'Остановить выдачу', pl: 'Zatrzymaj wydawanie' },
  'Send to Device': { ru: 'Отправить на устройство', pl: 'Wyślij do urządzenia' },
  'Or select specific devices:': { ru: 'Или выберите конкретные устройства:', pl: 'Lub wybierz konkretne urządzenia:' },
  'No devices': { ru: 'Нет устройств', pl: 'Brak urządzeń' },
  'Allowed ports:': { ru: 'Разрешённые порты:', pl: 'Dozwolone porty:' },
  'Port': { ru: 'Порт', pl: 'Port' },
  'Apply Assignment': { ru: 'Применить назначение', pl: 'Zastosuj przypisanie' },
  'Start Card Number': { ru: 'Начальный номер карты', pl: 'Początkowy numer karty' },
  'Device (optional)': { ru: 'Устройство (опционально)', pl: 'Urządzenie (opcjonalnie)' },
  'No device': { ru: 'Без устройства', pl: 'Bez urządzenia' },
  'Loading...': { ru: 'Загрузка...', pl: 'Ładowanie...' },
  'Device assignments': { ru: 'Назначения устройств', pl: 'Przypisania urządzeń' },
  'Last used:': { ru: 'Последнее использование:', pl: 'Ostatnie użycie:' },
  'Cards to assign:': { ru: 'Карты для назначения:', pl: 'Karty do przypisania:' },
  'Or select specific devices:': { ru: 'Или выберите конкретные устройства:', pl: 'Lub wybierz konkretne urządzenia:' },
};

function stringToKey(str) {
  return str.trim()
    .split(/[\s-_]+/)
    .map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '');
}

function main() {
  try {
    console.log('\n🔧 Reading files...');
    
    if (!fs.existsSync(COMPONENT_PATH)) throw new Error(`Not found: ${COMPONENT_PATH}`);
    let code = fs.readFileSync(COMPONENT_PATH, 'utf-8');
    
    if (!fs.existsSync(TRANSLATIONS_PATH)) throw new Error(`Not found: ${TRANSLATIONS_PATH}`);
    let transFile = fs.readFileSync(TRANSLATIONS_PATH, 'utf-8');
    
    console.log('✓ Files loaded\n');
    console.log('🔍 Finding TEXT between tags: >{text}<\n');
    
    let replacedCount = 0;
    const translations = { en: {}, ru: {}, pl: {} };
    
    Object.entries(TEXTS).forEach(([text, trans_obj]) => {
      const key = stringToKey(text);
      const fullKey = `isCards${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      
      const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`>(${escaped})<`, 'g');
      
      if (pattern.test(code)) {
        code = code.replace(pattern, `>{t("${fullKey}")}<`);
        replacedCount++;
        
        translations.en[fullKey] = text;
        translations.ru[fullKey] = trans_obj.ru;
        translations.pl[fullKey] = trans_obj.pl;
        
        console.log(`  ✓ "${text}" → t("${fullKey}")`);
      }
    });
    
    if (replacedCount === 0) {
      console.log('No text found to replace!\n');
      return;
    }
    
    console.log(`\n✓ Replaced ${replacedCount} text strings\n`);
    console.log('🌐 Adding to translations.ts...\n');
    
    const languages = ['en', 'ru', 'pl'];
    
    languages.forEach(lang => {
      const isCCardsStart = transFile.indexOf(`${lang}: {`);
      if (isCCardsStart === -1) {
        console.log(`  ⚠️  Could not find ${lang}`);
        return;
      }
      
      const afterLang = transFile.substring(isCCardsStart);
      const isCCardsMatch = afterLang.match(/isCards:\s*\{/);
      if (!isCCardsMatch) {
        console.log(`  ⚠️  No isCards in ${lang}`);
        return;
      }
      
      const isCStart = isCCardsStart + afterLang.indexOf(isCCardsMatch[0]);
      
      let braces = 0;
      let isCEnd = isCStart;
      for (let i = isCStart + 'isCards: {'.length; i < transFile.length; i++) {
        if (transFile[i] === '{') braces++;
        if (transFile[i] === '}') {
          if (braces === 0) {
            isCEnd = i;
            break;
          }
          braces--;
        }
      }
      
      let newLines = '';
      Object.entries(translations[lang]).forEach(([key, value]) => {
        const val = value.replace(/'/g, "\\'");
        newLines += `\n        ${key}: '${val}',`;
      });
      
      transFile = transFile.substring(0, isCEnd) + newLines + transFile.substring(isCEnd);
      console.log(`  ✓ ${lang.toUpperCase()}: Added ${Object.keys(translations[lang]).length} keys`);
    });
    
    console.log('\n💾 Saving files...');
    fs.writeFileSync(COMPONENT_PATH, code, 'utf-8');
    fs.writeFileSync(TRANSLATIONS_PATH, transFile, 'utf-8');
    console.log('✓ Files saved\n');
    
    console.log('✨ SUCCESS!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();