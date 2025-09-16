import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface ScoringInputProps {
  value: number;
  onChange: (value: number) => void;
  id?: string;
  label?: string;
}

export function ScoringInput({ value, onChange, id = "score", label = "Score" }: ScoringInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    const numValue = parseInt(newValue) || 0;
    const clampedValue = Math.max(0, Math.min(100, numValue));
    onChange(clampedValue);
  };

  const handleSliderChange = (values: number[]) => {
    const newValue = values[0];
    setInputValue(newValue.toString());
    onChange(newValue);
  };

  const getScoreColor = (score: number) => {
    if (score >= 61) return 'text-green-600 border-green-300 bg-green-50';
    if (score >= 31) return 'text-yellow-600 border-yellow-300 bg-yellow-50';
    return 'text-red-600 border-red-300 bg-red-50';
  };

  const getSliderColor = (score: number) => {
    if (score >= 61) return 'bg-green-500';
    if (score >= 31) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="space-y-3 mt-2">
        <div className="flex items-center gap-3">
          <Input
            id={id}
            type="number"
            min="0"
            max="100"
            value={inputValue}
            onChange={handleInputChange}
            className={`w-20 text-center font-semibold ${getScoreColor(value)}`}
          />
          <div className="flex-1">
            <Slider
              value={[value]}
              onValueChange={handleSliderChange}
              min={0}
              max={100}
              step={1}
              className="w-full"
              style={{
                '--slider-bg': getSliderColor(value)
              } as React.CSSProperties}
            />
          </div>
          <div className="text-sm text-muted-foreground w-8 text-right">
            {value}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {value >= 61 && <span className="text-green-600">Alto</span>}
          {value >= 31 && value < 61 && <span className="text-yellow-600">Médio</span>}
          {value < 31 && <span className="text-red-600">Baixo</span>}
        </div>
      </div>
    </div>
  );
}
