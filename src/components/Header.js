import React from 'react';
import { useTranslation } from 'react-i18next';
import './Header.css';

const Header = ({ selectedRange, onSelectRange, onLocationChange, selectedLocation }) => {
  const { t, i18n } = useTranslation();

  const handleLangChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
  };

  const handleLocationChange = (e) => {
    onLocationChange(e.target.value);
  }

  return (
    <div className="header">
      <div className="header-left">
        <h1 className="header-title">{t('weather_dashboard')}</h1>
        <select className="location-selector" onChange={handleLocationChange} value={selectedLocation}>
          <option value="Kicukiro">Kicukiro</option>
          <option value="Nyarugenge">Nyarugenge</option>
          <option value="Gasabo">Gasabo</option>
          <option value="Musanze">Musanze</option>
          <option value="Rubavu">Rubavu</option>
        </select>
      </div>
      <div className="header-right">
        <div className="time-range-selector">
          <button onClick={() => onSelectRange('today')} className={selectedRange === 'today' ? 'active' : ''}>{t('today')}</button>
          <button onClick={() => onSelectRange('week')} className={selectedRange === 'week' ? 'active' : ''}>{t('week')}</button>
          <button onClick={() => onSelectRange('month')} className={selectedRange === 'month' ? 'active' : ''}>{t('month')}</button>
        </div>
        <select className="language-selector" onChange={handleLangChange} value={i18n.language}>
          <option value="rw">Kinyarwanda</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>
    </div>
  );
};

export default Header; 