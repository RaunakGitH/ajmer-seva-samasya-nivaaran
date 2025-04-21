
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

type Language = 'en' | 'hi' | 'raj';

interface LanguageSwitcherProps {
  onChange?: (language: Language) => void;
}

export function LanguageSwitcher({ onChange }: LanguageSwitcherProps) {
  const [language, setLanguage] = useState<Language>('en');

  const languages = {
    en: 'English',
    hi: 'हिंदी',
    raj: 'राजस्थानी'
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    if (onChange) onChange(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {languages[language]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('hi')}>
          हिंदी
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('raj')}>
          राजस्थानी
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
