
import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface VoiceTextInputProps {
  onTextChange: (text: string) => void;
  initialText?: string;
  label?: string;
  placeholder?: string;
}

export function VoiceTextInput({
  onTextChange,
  initialText = '',
  label = 'Description',
  placeholder = 'Describe the issue in detail...'
}: VoiceTextInputProps) {
  const [text, setText] = useState(initialText);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<string>('en-US');
  const [supportedLanguages, setSupportedLanguages] = useState<{code: string, name: string}[]>([
    { code: 'en-US', name: 'English' },
    { code: 'hi-IN', name: 'हिंदी (Hindi)' },
    { code: 'en-IN', name: 'Indian English' },
  ]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Cleanup function for when component unmounts
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('Error stopping speech recognition:', e);
        }
      }
    };
  }, []);

  const startListening = () => {
    try {
      // Cast window to any to access Speech Recognition API
      const SpeechRecognition = (window as any).SpeechRecognition || 
                               (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert('Speech recognition is not supported in your browser. Please type your complaint or try another browser.');
        return;
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Update text with final transcript and interim results
        if (finalTranscript) {
          const updatedText = text + ' ' + finalTranscript;
          setText(updatedText);
          onTextChange(updatedText);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.error('Error restarting speech recognition:', e);
            setIsListening(false);
          }
        }
      };

      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      alert('Could not start speech recognition. Please type your complaint instead.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping speech recognition:', e);
      }
    }
    setIsListening(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onTextChange(e.target.value);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    // If already listening, restart recognition with new language
    if (isListening) {
      stopListening();
      setTimeout(() => startListening(), 100);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <Label htmlFor="description">{label}</Label>
        <div className="flex items-center space-x-2">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {supportedLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Textarea
        id="description"
        placeholder={placeholder}
        value={text}
        onChange={handleTextChange}
        className="min-h-32"
      />
      
      <div className="flex justify-end space-x-2">
        {isListening ? (
          <Button
            type="button"
            variant="destructive"
            onClick={stopListening}
          >
            <StopCircle className="mr-2 h-4 w-4" />
            Stop Recording
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={startListening}
          >
            <Mic className="mr-2 h-4 w-4" />
            Start Voice Input
          </Button>
        )}
      </div>
      
      {isListening && (
        <div className="flex items-center p-2 bg-red-50 text-red-600 rounded-md">
          <MicOff className="h-5 w-5 mr-2 animate-pulse" />
          <span>Listening... Speak now</span>
        </div>
      )}
    </div>
  );
}
